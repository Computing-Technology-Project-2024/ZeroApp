import requests

from config import ECX_API_KEY, ECX_BASE_URL


# TEMP (DELETE AFTER DEVELOPMENT): set Base Url to 'https://api.edgeapi-v1.com/swinburn'
def fetch_critical_parameters(device_serial_id, start_time, end_time):
    """
    Fetch critical parameters of a device from the EdgeConX API.

    :param device_serial_id: Serial ID of the device
    :param start_time: Start time of the data interval (Unix timestamp)
    :param end_time: End time of the data interval (Unix timestamp)
    :return: JSON response containing critical parameters
    """

    url = f"{ECX_BASE_URL}/powerquality/interval/{device_serial_id}?starttime={start_time}&endtime={end_time}"
    headers = {'x-api-key': ECX_API_KEY}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def fetch_device_parameters():
    """
    Fetch a list of devices from the EdgeConX API.

    :return: JSON response containing device parameters
    """
    url = f"{ECX_BASE_URL}/devices"
    headers = {'x-api-key': ECX_API_KEY}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# Example usage:
# critical_params = ecx_api.fetch_critical_parameters('EE40400611940036', 1713621600, 1713708000)
# device_params = ecx_api.fetch_device_parameters()
