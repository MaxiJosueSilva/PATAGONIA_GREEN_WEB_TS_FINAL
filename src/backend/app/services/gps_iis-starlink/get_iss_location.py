import requests

def get_iss_location():
    url = "http://api.open-notify.org/iss-now.json"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        position = data['iss_position']
        print(f"ISS Location - Latitude: {position['latitude']}, Longitude: {position['longitude']}")
    else:
        print(f"Failed to get ISS location. Status code: {response.status_code}")


def get_starlink_satellites():
    url = "https://api.spacexdata.com/v4/starlink"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        for satellite in data:
            if 'latitude' in satellite and 'longitude' in satellite:
                print(f"Starlink Satellite - ID: {satellite['id']}, Latitude: {satellite['latitude']}, Longitude: {satellite['longitude']}")
    else:
        print(f"Failed to get Starlink satellites data. Status code: {response.status_code}")

#get_iss_location()
get_starlink_satellites()