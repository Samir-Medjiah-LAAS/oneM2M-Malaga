// Version 1.0*

var request = require('request');

var sensorToMonitor = "TiltSensor";
var originator = "Cae-" + sensorToMonitor;

var options = {
	uri: "http://127.0.0.1:8080/server/" + sensorToMonitor + "/DATA/la",
	method: "GET",
	headers: {
		"X-M2M-Origin": originator ,
		"Content-Type": "application/json"
	}
};

console.log("Sending request >>> ");
console.log(options.method + " " + options.uri);

request(options, function (err, resp, body) {
	console.log("\n\n<<< Response received ! ");
	if(err) {
		console.log("Error = " + err);
	} else {
		console.log("Response Status Code = " + resp.statusCode);
		console.log("Response Body = " + body);

		var obj = JSON.parse(body);
		console.log("\n\nEffective content of CIN = " + obj["m2m:cin"].con);
	}
});	
