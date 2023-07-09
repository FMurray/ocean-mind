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
    5000, 
    results_per_page=20,
    n_workers=10,
)

asyncio.run(fetcher.fetch_all())

