# Version 1.1

import requests
import json
from flask import Flask
from flask import request

monitorIP = '127.0.0.1'
monitorPort = 9000
monitorPoA = "http://" + str(monitorIP) + ":" + str(monitorPort)

sensorToMonitor = "TiltSensor"
actuatorToTrigger = "LedActuator"
appOriginator = "Cae-Monitor"

isLedOn = False
sensorOffState = 1


def createSUB():
    response = requests.post('http://127.0.0.1:8080/server/' + sensorToMonitor + '/DATA', 
                json={
                    "m2m:sub": {
                        "rn": "SUB_Monitor",
                        "nu": ["server/Monitor"],
                        "nct": 2,
                        "enc": {
                            "net": 3
                        }
                    }
                }, 
                headers={
                    'Content-Type': 'application/json;ty=23',
                    'X-M2M-Origin': appOriginator
                    }
                )
    if response.status_code != 201:
        print("SUB Creation error : ", response.text)
    else:
        print("SUB Creation :" , response.status_code)

def createAE():
    response = requests.post('http://127.0.0.1:8080/server/', 
                json={
                    "m2m:ae": {
                        "rn": "Monitor", 
                        "api":"org.demo.monitor-app",
                        "rr":"true",
                        "poa":[ monitorPoA ]
                    }
                }, 
                headers={
                    'Content-Type': 'application/json;ty=2',
                    'X-M2M-Origin': appOriginator
                    }
                )
    if response.status_code != 201:
        print("AE Creation error : ", response.text)
    else:
        print("AE Creation :", response.status_code)
    createSUB()

def createCIN(commandName):
    response = requests.post('http://127.0.0.1:8080/server/' + actuatorToTrigger + '/COMMAND', 
                json={
                    "m2m:cin": {
                        "con": commandName
                    }
                }, 
                headers={
                    'Content-Type': 'application/json;ty=4',
                    'X-M2M-Origin': appOriginator
                    }
                )
    if response.status_code != 201:
        print("CIN Creation error : ", response.text)
    else:
        print("CIN Creation :", response.status_code)


api = Flask(__name__)

@api.route('/', methods=['POST'])
def processNotification():
    global isLedOn
    notificationJSON = request.json
    sensorValue = int(notificationJSON['m2m:sgn']['nev']['rep']['m2m:cin']['con'])
    print("Receieved sensor value : ", sensorValue)
    if (sensorValue == sensorOffState) and (isLedOn == True) :
        print ( "Tilt deactivated => Switch Off the led")
        createCIN("[switchOff]")
        isLedOn = False
    elif (sensorValue != sensorOffState) and (isLedOn == False) :      
        print("Tilt activated => Switch On the led")
        createCIN("[switchOn]")
        isLedOn = True
    else:
            print("Nothing to do")
    return ('', 200)

if __name__ == '__main__':
    createAE()
    api.run(host=monitorIP, port=monitorPort)