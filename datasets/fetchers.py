import asyncio
import httpx 
from concurrent.futures import ThreadPoolExecutor
from threading import current_thread

class AsyncPaginator:
    def __init__(self, base_url, total_results, results_per_page, query):
        self.base_url = base_url
        self.total_pages = total_results // results_per_page
        self.results_per_page = results_per_page
        self.current_page = 0
        self.query = query

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current_page >= self.total_pages:
            raise StopAsyncIteration
        self.current_page += 1
        response = await self.fetch_page(self.current_page, self.query)
        print(response)
        return response

    async def fetch_page(self, page, query):
        query['page'] = {
            "max": self.results_per_page,
            "offset": (page - 1) * self.results_per_page
        }
        async with httpx.AsyncClient() as client:
            response = await client.post('https://data.noaa.gov/onestop/api/search/search/collection', json=query)
        return response.json()
        
async def _async_paginated_fetcher(url, total_results, results_per_page, handle_results, query):
    """For use in Jupyter, import and await this function directly"""
    queue = asyncio.Queue()
    loop = asyncio.get_running_loop()
    paginator = AsyncPaginator(url, total_results, results_per_page, query)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [loop.run_in_executor(executor, paginator.__anext__) for _ in range(10)]
        for future in asyncio.as_completed(futures):
            data = await future
            print(data)
            handle_results(data)

def async_paginated_fetcher(url, total_results, results_per_page, handle_results, query):
    asyncio.run(_async_paginated_fetcher(url, total_results, results_per_page, handle_results, query))

