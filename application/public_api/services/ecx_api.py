import requests

# the api key and url is hard-coded for now, will switch to env vars when possible
API_KEY = 'JjsFazxTPd7GVoPYGdEI34HrudDZHq695FqKKnmU'
BASE_URL = 'https://api.edgeapi-v1.com/swinburn'

def fetch_critical_parameters(device_serialid, starttime, endtime):
    """
    Fetch critical parameters from the EdgeConX API.

    :param device_serialid: Serial ID of the device
    :param starttime: Start time of the data interval (Unix timestamp)
    :param endtime: End time of the data interval (Unix timestamp)
    :return: JSON response containing critical parameters
    """

    # TODO: implement dotenv
    url = f"{BASE_URL}/powerquality/interval/{device_serialid}?starttime={starttime}&endtime={endtime}"
    headers = {'x-api-key': API_KEY}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def fetch_device_parameters():
    """
    Fetch device parameters from the EdgeConX API.

    :return: JSON response containing device parameters
    """
    url = f"{BASE_URL}/devices"
    headers = {'x-api-key': API_KEY}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# Example usage:
# critical_params = ecx_api.fetch_critical_parameters('EE40400611940036', 1713621600, 1713708000)
# device_params = ecx_api.fetch_device_parameters()
