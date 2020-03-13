# Version 1.1

import requests
import json

sensorDataContainer = "TiltSensor/DATA"

print("Sending request >>> ")
response = requests.get('http://127.0.0.1:8080/server/' + sensorDataContainer + '?rcn=4', 
                        headers={'Accept': 'application/json'})

print("<<< Response received ! ")

if response.status_code != 200:
    print("Error = ", response.text)
else:
    print("Effective content of CINs = ")
    contentInstanceInJSON = json.loads(response.content)
    for elt in contentInstanceInJSON['m2m:cnt']['cin']:
        print("   " + elt['con'])


