from datasets import AsyncPaginatedFetcher
import asyncio

query = {  
    "queries": [
        {
            "type" : "queryText",
            "value": "temperature"
        }      
    ],
    "summary": False
}

fetcher = AsyncPaginatedFetcher(
    'https://data.noaa.gov/onestop/api/search/search/collection',
    query,
    10000, 
    results_per_page=40,
    n_workers=20,
)

asyncio.run(fetcher.fetch_all())

