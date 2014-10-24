// manager.js

var request = require("request");
var socketio = require("socket.io-client");

var Manager = function(url)
{
	this.url = url;
	this.token = null;
	this.socket = null;
};

Manager.prototype.getToken = function(user, password, callback)
{
	var self = this;

	request(
		{
			method: "POST",
			uri: self.url + "/api/token",
			headers:
			{	
				"content-type": "application/json"
			},
			body:
			{
				"user": user, "password": password
			},
			json: true
		}, 
		function(error, response, body)
		{
			if(error) return callback(error);
			if(!body.token) return callback(new Error("ERROR: didn't get token..."));
			
			self.token = body.token;

			callback(false);
			
		});

};

Manager.prototype.getSocket = function(callback)
{
	var self = this;
	self.socket = socketio.connect(self.url, { query: "token=" + self.token });
	self.socket.on("connect", function()
		{
			console.log("Socket connected");
			if(callback) callback();
		});
};

Manager.prototype.getDevices = function(query, callback)
{
	var self = this;
	var path = "/api/devices";
	
	request(
		{
			method: "GET",
			uri: self.url + path,
			qs: query,
			headers:
			{	
				"Authorization": "Bearer " + self.token
			}
		},
		function(error, response, body)
		{
			if(error) return callback(error);
			callback(null, JSON.parse(body));
		});
};

Manager.prototype.requestAction = function(deviceid, action, param)
{
	var self = this;
	if(typeof deviceid !== "string") return new Error("invalid deviceid");
	var path = "/api/devices/" + deviceid + "/action/" + String(action);
	if(param !== null && typeof(param) !== "undefined") path += "/" + String(param);

	request(
		{
			method: "GET",
			uri: self.url + path,
			headers:
			{	
				"Authorization": "Bearer " + self.token
			}
		},
		function(error, response, body)
		{
			if(error) return console.log(error);
		});
};

Manager.prototype.getPAN = function(callback)
{
	var self = this;
	var path = "/api/pan";

	request(
		{
			method: "GET",
			uri: self.url + path,
			headers:
			{	
				"Authorization": "Bearer " + self.token
			}
		},
		function(error, response, body)
		{
			if(error) return callback(error);
			if(callback) callback(null, JSON.parse(body));
		});
};

Manager.prototype.setPAN = function(pan, callback)
{
	var self = this;
	var path = "/api/pan";

	request(
		{
			method: "POST",
			uri: self.url + path,
			headers:
			{	
				"Authorization": "Bearer " + self.token,
				"content-type": "application/json"
			},
			body:
			{
				"pan": pan
			},
			json: true
		},
		function(error, response, body)
		{
			if(error) return callback(error);
			if(callback) callback(null, JSON.parse(body));
		});
};

Manager.prototype.discover = function(callback)
{
	var self = this;
	var path = "/api/discover";

	request(
		{
			method: "GET",
			uri: self.url + path,
			headers:
			{	
				"Authorization": "Bearer " + self.token
			}
		},
		function(error, response, body)
		{
			if(error) return callback(error);
			if(callback) callback(null, JSON.parse(body));
		});

};

Manager.prototype.reload = function(callback)
{
	var self = this;
	var path = "/api/reload";

	request(
		{
			method: "GET",
			uri: self.url + path,
			headers:
			{	
				"Authorization": "Bearer " + self.token
			}
		},
		function(error, response, body)
		{
			if(error) return callback(error);
			if(callback) callback(null, JSON.parse(body));
		});
};

module.exports = Manager;