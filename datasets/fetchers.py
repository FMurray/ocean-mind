import asyncio
import httpx
import pandas as pd
from time import sleep, time

class AsyncPaginatedFetcher():
    def __init__(self, base_url, query, total_results, n_workers=10, results_per_page=20, result_handler=callable):
        self.n_workers = n_workers
        self.base_url = base_url
        self.total_pages = total_results // results_per_page
        self.results_per_page = results_per_page
        self.results_processed = 0
        self.total_results = total_results
        self.current_page = 0
        self.query = query
        self.query_text = query['queries'][0]['value']
        self.result_handler = result_handler
        self.queue = asyncio.Queue()
        self.failed_writes: pd.DataFrame = pd.DataFrame({'id': [], 'onestop_query': [], 'exception': []})

    def _populate_queue(self, queue):
        _total_pages = self.total_pages
        while _total_pages > 0:
            _total_pages -= 1
            page = {
                "max": self.results_per_page,
                "offset": (_total_pages) * self.results_per_page
            }
            _query = self.query.copy()
            _query['page'] = page
            queue.put_nowait(_query)

    async def fetch_all(self):
        self._populate_queue(self.queue)

        tasks = []
        for i in range(self.n_workers):
            task = asyncio.create_task(self._worker(self.queue))
            tasks.append(task)
        print(f"Created {len(tasks)} tasks...")

        # Wait until the queue is fully processed.
        await self.queue.join()

        # Cancel our worker tasks.
        for task in tasks:
            task.cancel()

        # Wait until all worker tasks are cancelled.
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for results in results: 
            if results.__class__ == Exception:
                print(f"Exception in worker: {results}")
                continue

        print('==== DONE =====')
        print(f"Total results processed: {self.results_processed} / {self.total_results}")
        
    async def _worker(self, queue):
        print("Worker started...")
        sleepytime = 1
        while True:
            try: 
                async with httpx.AsyncClient() as client:
                    sleep(sleepytime // 1000)
                    query = await queue.get()
                    df = None
                    response = None
                    try:
                        response = await client.post('https://data.noaa.gov/onestop/api/search/search/collection', json=query)
                        if response.status_code == 500:
                            print(f"Error while fetching: {response.status_code}")
                            sleepytime *= 2
                            continue
                    except Exception as e:
                        print(f"Exception while fetching: {e}")
                        with open(f"./data/onestop/logs.txt", 'a') as f:
                            f.write(f"{query} -> {e}")
                        continue
                    
                    try:
                        data = response.json()
                        df = pd.json_normalize(data['data'])
                        dtypes = df.dtypes
                        df['attributes.spatialBounding.coordinates'] = df['attributes.spatialBounding.coordinates'].astype(str)
                        df['attributes.dataFormats'] = df['attributes.dataFormats'].astype(str)
                        df['onestop_query'] = self.query_text
                        self.results_processed += df.shape[0]
                        df.to_parquet(f"./data/onestop/{int(time())}.parquet")
                    except Exception as e:
                        print(f"Exception while writing to file: {str(e)}")
                        with open(f"./data/onestop/logs.txt", 'a') as f:
                            f.write(f"{query} -> {e}")
                        continue
                        # failed_df = df[['id', 'onestop_query']].drop_duplicates()
                        # failed_df = failed_df.assign(exception=str(e))

                        # self.failed_writes = pd.concat([self.failed_writes, failed_df], ignore_index=True)
                        
                    self.queue.task_done()
                    print(f"Finished fetching query: {query['page']['offset'] // self.results_per_page}")
            except asyncio.CancelledError:
                    print("Worker cancelled...")
                    break
            except Exception as e:
                print(f"Exception in worker: {e}")
                break
