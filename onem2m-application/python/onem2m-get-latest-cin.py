# Version 1.1

import requests
import json

sensorDataContainer = "TiltSensor/DATA"

print("Sending request >>> ")
response = requests.get('http://127.0.0.1:8080/server/' + sensorDataContainer + '/la', 
                        headers={'Accept': 'application/json'})

print("<<< Response received ! ")

if response.status_code != 200:
    print("Error = ", response.text)
else:
    cin = json.loads(response.content)
    print("Effective content of CIN = ", cin['m2m:cin']['con'])