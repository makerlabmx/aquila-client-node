// monitor.js

/*
	Example client app
*/

var config = {
	url: "http://localhost:8080",
	user: "Admin",
	password: "Admin",
	verbose: true
};

var Aquila = require("./aquila");
aq = new Aquila(config.url);
var repl = require("repl");

aq.login(config.user, config.password, function(err)
	{
		if(err) return console.log(err.message);

		if(config.verbose)
		{
			aq.manager.socket.on("deviceAdded", function(){ console.log("\nLOG: Device Added"); });
			aq.manager.socket.on("deviceRemoved", function(){ console.log("\nLOG: Device Removed"); });
			aq.manager.socket.on("event", function(device, eventN, param){ 
					console.log("\nLOG: Got Event from: ", device.name, ", Event: ", eventN, ", Param: ", param);
				});
		}

		console.log("Monitor Ready");
		repl.start(">");
	});