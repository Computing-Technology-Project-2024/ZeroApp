from abc import ABC, abstractmethod


'''
    This is an interface. Please don't make implementation here.
'''

class EcxApiInterface(ABC):
    @abstractmethod
    def fetch_critical_parameters(self):
        pass

    @abstractmethod
    def fetch_device_parameters(self):
        pass
