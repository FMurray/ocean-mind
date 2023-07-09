from dataclasses import dataclass, replace
from enum import Enum
import httpx


@dataclass
class OneStopSearchQuery():
    """Configuration for OneStop Search API"""
    # coordinates:
    queryText: str

class OneStopCollection:
    name = 'collection'

class OneStopResourceType(str, Enum):
    """OneStop Resource Types"""
    collection = 'collection'
    granule = 'granule'
    flattened_granule = 'flattened_granule'

class OneStopSearch(): 
    base_url = 'https://data.noaa.gov/onestop/api/search'
    title = "OneStop Search API"
    description = """
    Search Collections and Granules! More information on search request and responses available at 
    [Search API Requests](https://github.com/cedardevs/onestop/blob/master/docs/public-user/api/requests.md) 
    and [Search API Responses](https://github.com/cedardevs/onestop/blob/master/docs/public-user/api/responses.md).
    Swagger: https://app.swaggerhub.com/apis/cedarbot/OneStop-Search/3.0.0-RC1
    """

    def __init__(self, cfg=None):
        self.cfg = cfg


    def search(self, resource_type, query=None):
        """Returns the documentation for the resource type"""
        with httpx.Client() as client:
            url = f'{self.base_url}/{resource_type}'
            response = client.get(url, params=query).json()
            return response