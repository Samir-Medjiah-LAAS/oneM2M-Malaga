// Version 1.1

var request = require('request');

var sensorDataContainer = "TiltSensor/DATA";

var options = {
	uri: "http://127.0.0.1:8080/server/" + sensorDataContainer + "?rcn=4",
	method: "GET",
	headers: {
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
		console.log("\n\nEffective content of CINs = ");
		obj["m2m:cnt"]["cin"].forEach(elt => {
			console.log(elt.con);	
		});
	}
});
