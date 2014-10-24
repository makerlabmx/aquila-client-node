// aquila.js
var Manager = require("./Manager");
var AquilaDevices = require("./AquilaDevices");
var util = require("util");

var arrayCmp = function(arr1, arr2)
{
	if (arr1.length == arr2.length
	&& arr1.every(function(u, i) {
		return u === arr2[i];
	})
	) {
	   return true;
	} else {
	   return false;
	}
};

var Aquila = function(url)
{
	this.manager = new Manager(url);
	this._devices = [];
};

Aquila.prototype.login = function(user, password, callback)
{
	var self = this;
	self.manager.getToken(user, password, function(err)
	{
		if(err) return callback(err);
		self.manager.getSocket(function(err)
			{
				if(err) return callback(err);
				self._updateDevices(function(err)
					{
						if(err) return callback(err);
						// Subscribe to update events
						self.manager.socket.on("deviceAdded", function()
							{
								self._updateDevices(function(err){});
							});
						self.manager.socket.on("deviceRemoved", function()
							{
								self._updateDevices(function(err){});
							});

						callback(null);
					});
			});
	});
};

Aquila.prototype._updateDevices = function(callback)
{
	var self = this;
	self.manager.getDevices(null, function(err, devices)
		{
			if(err) return callback(err);
			self._devices = devices;
			callback(null);
		});
};

Aquila.prototype.devices = function(query)
{
	var self = this;
	var selection = [];
	if(!query || query === "*") return new AquilaDevices(self.manager, self._devices);
	// search by address
	if(util.isArray(query))
	{
		for(var i = 0; i < self._devices.length; i++)
		{
			if(arrayCmp(self._devices[i].address, query)) selection.push(self._devices[i]);
		}
		return new AquilaDevices(self.manager, selection);
	}
	// search by class
	if(query[0] === ".")
	{
		query = query.substring(1);
		for(var i = 0; i < self._devices.length; i++)
		{
			if(self._devices[i].class === query) selection.push(self._devices[i]);
		}
		return new AquilaDevices(self.manager, selection);
	}
	// search by name
	if(query[0] === "#")
	{
		query = query.substring(1);
		for(var i = 0; i < self._devices.length; i++)
		{
			if(self._devices[i].name === query) selection.push(self._devices[i]);
		}
		return new AquilaDevices(self.manager, selection);
	}

	// lastly, search by _id
	if(typeof(query) === "string")
	{
		for(var i = 0; i < self._devices.length; i++)
		{
			if(self._devices[i]._id === query) selection.push(self._devices[i]);
		}
		return new AquilaDevices(self.manager, selection);
	}
};

Aquila.prototype.discover = function(callback)
{
	var self = this;
	self.manager.discover(callback);
};

Aquila.prototype.reload = function(callback)
{
	var self = this;
	self.manager.reload(callback);
};

Aquila.prototype.getPAN = function(callback)
{
	var self = this;
	self.manager.getPAN(callback);
};

Aquila.prototype.setPAN = function(pan, callback)
{
	var self = this;
	self.manager.setPAN(pan, callback);
};

module.exports = Aquila;