import httpx
import pandas as pd

class NCEIServices(): 
    base_url = 'https://www.ncei.noaa.gov/access/services'
    datasets = None

    def __init__(self):
        self.load()

    def load(self):
        if self.datasets is None:
            with httpx.Client() as client:
                url = f'{self.base_url}/support/v3/datasets.json'
                response = client.get(url).json()
                self.datasets = response['results']
                
            return self.datasets
            
    def get_dataset(self, id, start_date=None, end_date=None):
        return NCEIServicesDataset(id, start_date, end_date).load()

class NCEIServicesDataset():
    base_url = 'https://www.ncei.noaa.gov/access/services/data/v1'
    
    def __init__(self, id, start_date=None, end_date=None): 
        self.id = id
        self.start_date = start_date
        self.end_date = end_date

    def load(self):
        with httpx.Client() as client:
            response = client.get(self.base_url, params={'dataset': self.id, 'startDate': self.start_date, 'endDate': self.end_date}).json()
            return response
            # return pd.DataFrame(response['results'])