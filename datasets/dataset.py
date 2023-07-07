from abc import ABC

class DatasetBase(ABC): 
    # def __len__(self):
    #     return len(self.data)

    # def __getitem__(self, index):
    #     data = self.data[index]
    #     label = self.labels[index]

    #     if self.transform:
    #         data = self.transform(data)

    #     return data, label
    
    def load(self):
        raise NotImplementedError