// app.js
// Example app using aquila-client

var Aquila = require("./aquila");
var aq = new Aquila("http://localhost:8080");

aq.login("Admin", "Admin", function(err)
	{
		if(err) return console.log(err);

		/*aq.manager.getDevices({ /*name: "Button"* }, function(err, devices)
			{
				if(err) return console.log(err);
				console.log(devices);
			});*/

		aq.devices().on("Button Pressed", function(param)
			{
				console.log("Lalalal Event!!!");
			});

		/*aq.devices();		// Returns all devices
		aq.devices("*");	// '' ''
		aq.devices("#RGB"); // Returns an array of devices with name RGB
		aq.devices(".mx.makerlab.apagador"); // Returns an array of devices with class mx.makerlab.apagador

		aq.getPAN(callback);
		aq.setPAN(callback);
		aq.discover(cb);
		aq.reload(cb);*/
	});