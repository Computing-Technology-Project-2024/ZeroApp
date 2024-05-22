from abc import ABC, abstractmethod

'''
    This is an interface. Please don't make implementation here.
'''

class SiteRepositoryInterface(ABC):
    @abstractmethod
    def get_all_sites(self):
        pass

    @abstractmethod
    def get_site_by_id(self, id):
        pass