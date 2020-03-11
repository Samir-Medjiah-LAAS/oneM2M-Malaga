// Version 1.0

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


var monitorIP = "127.0.0.1";
var monitorPort = 9090;



var sensorOffState = 1;

var sensorToMonitor = "TiltSensor";
var actuatorToTrigger = "LedActuator";
var isLedOn = false;

var appOriginator    = "Cae-Monitor";

app.use(bodyParser.json());

// start http server
app.listen(monitorPort, function () {
	console.log("Listening on: " + monitorIP + ":" + monitorPort);
});


// handle received http messages
app.post('/', function (req, res) {
	var  vrq  = req.body["m2m:sgn"]["m2m:vrq"];
	if  (!vrq) {
		var sensorValue = req.body["m2m:sgn"]["nev"]["rep"]["m2m:cin"].con;
		console.log("Receieved sensor value : " + sensorValue);

		if(sensorValue == sensorOffState && isLedOn ){
			console.log("Tilt deactivated => Switch Off the led");
			createCIN("[switchOff]");
			isLedOn=false;
		}else if(sensorValue != sensorOffState && !isLedOn){
			console.log("Tilt activated => Switch On the led");
			createCIN("[switchOn]")
			isLedOn=true;
		}else{
			console.log("Nothing to do");
		}
	}
	res.sendStatus(200);	
});

createAE();
function createAE(){
	var options = {
		uri: "http://127.0.0.1:8080/server/",
		method: "POST",
		headers: {
			"X-M2M-Origin": appOriginator,
			"Content-Type": "application/json;ty=2"
		},
		json: { 
			"m2m:ae":{
				"rn": "Monitor",			
				"api":"org.demo.app",
				"rr":"true",
				"poa":["http://"+ monitorIP + ":" + monitorPort]
			}
		}
	};

	request(options, function (err, resp, body) {
		if(err){
			console.log("AE Creation error : " + err);
		} else {
			console.log("AE Creation :" + resp.statusCode);
			createSUB();
		}
	});
}


function createSUB(){
	var options = {
		uri: "http://127.0.0.1:8080/server/" + sensorToMonitor + "/DATA",
		method: "POST",
		headers: {
			"X-M2M-Origin": appOriginator,
			"Content-Type": "application/json;ty=23"
		},
		json: {
			"m2m:sub": {
				"rn": "SUB_Monitor",
				"nu": ["server/Monitor"],
				"nct": 2,
				"enc": {
					"net": 3
				}
			}
		}
	};

	request(options, function (err, resp, body) {
		if(err){
			console.log("SUB Creation error : " + err);
		}else{
			console.log("SUB Creation : " + resp.statusCode);
		}
	});
}

function createCIN(commandName){
	var options = {
		uri: "http://127.0.0.1:8080/server/" + actuatorToTrigger + "/COMMAND",
		method: "POST",
		headers: {
			"X-M2M-Origin": appOriginator,
			"Content-Type": "application/json;ty=4"
		},
		json: {
			"m2m:cin":{
					"con": commandName
				}
			}
	};

	request(options, function (err, resp, body) {
		if(err){
			console.log("CIN Creation error : " + err);
		}else{
			console.log("CIN Creation : " + resp.statusCode);
		}
	});
}


