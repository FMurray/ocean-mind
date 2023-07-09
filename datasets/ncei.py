import httpx
import pandas as pd
import collections
from typing import List
import datetime as dt
from dataclasses import dataclass, replace


@dataclass 
class NCEICfg():
    """Configuration for NCEI Services"""
    """Default start date is 90 days ago"""
    start_date = dt.datetime.today() - dt.timedelta(days=90) 
    end_date = dt.datetime.today()

class NCEIServicesDataset():
    """
    NCEI Services Dataset: 
    Configure the dataset by calling the load method with a NCEICfg
    """
    loaded = False
    base_url = 'https://www.ncei.noaa.gov/access/services/data/v1'
    
    def __init__(self, id, cfg: NCEICfg): 
        self.id = id
        self.cfg = cfg

    def load(self, **kwargs):
        cfg = replace(self.cfg, **kwargs)
        start = cfg.start_date.strftime('%Y-%m-%d')
        end = cfg.end_date.strftime('%Y-%m-%d')

        if self.loaded:
            with httpx.Client() as client:
                try:
                    response = client.get(self.base_url, params={'dataset': self.id, 'startDate': start, 'endDate': end}).json()
                    self.loaded = True
                    return response
                except Exception as e:
                    self.loaded = False
                    print(e)
                # return pd.DataFrame(response['results'])
class NCEIServices(): 
    base_url = 'https://www.ncei.noaa.gov/access/services'
    datasets = {}

    def __init__(self, cfg=NCEICfg()):
        self.cfg = cfg
        self._load()

    def __len__(self):
        return len(self.datasets.keys())
            
    def __getitem__(self, key) -> NCEIServicesDataset:
        """Returns an unloaded dataset"""
        return NCEIServicesDataset(self.datasets[key], self.cfg)

    def _load(self):
        if self.datasets is None:
            with httpx.Client() as client:
                url = f'{self.base_url}/support/v3/datasets.json'
                response = client.get(url).json()
                self.datasets = response['results']
                
            return self.datasets

