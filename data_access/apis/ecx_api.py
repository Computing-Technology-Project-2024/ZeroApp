import requests

class EcxApi(EcxApiInterface):
    API_KEY = 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU'
    BASE_URL = 'https://api.edgeapi-v1.com/swinburn'

    def fetch_critical_parameters(self, device_serialid, starttime, endtime):
        """
        Fetch critical parameters from the EdgeConX API.
        
        :param device_serialid: Serial ID of the device
        :param starttime: Start time of the data interval (Unix timestamp)
        :param endtime: End time of the data interval (Unix timestamp)
        :return: JSON response containing critical parameters
        """
        url = f"{self.BASE_URL}/powerquality/interval/{device_serialid}?starttime={starttime}&endtime={endtime}"
        headers = {'x-api-key': self.API_KEY}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def fetch_device_parameters(self):
        """
        Fetch device parameters from the EdgeConX API.
        
        :return: JSON response containing device parameters
        """
        url = f"{self.BASE_URL}/devices"
        headers = {'x-api-key': self.API_KEY}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

# Example usage:
# ecx_api = EcxApi()
# critical_params = ecx_api.fetch_critical_parameters('EE40400611940036', 1713621600, 1713708000)
# device_params = ecx_api.fetch_device_parameters()
