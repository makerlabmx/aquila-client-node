// AquilaDevices.js

var events = require("events");
var util = require("util");

var AquilaDevice = function(manager, device)
{
	// copy everything from device
	util._extend(this, device);

	var self = this;
	manager.socket.on("event", function(device, eventN, param)
		{
			if(device._id === self._id)
			{
				self.emit(parseInt(eventN), param);
				// Search event name and emit event with its name
				var eventIndex = null;
				for(var i = 0; i < device.events.length; i++)
				{
					if(device.events[i].n === eventN)
					{
						eventIndex = i;
						continue;
					}
				}

				if(eventIndex !== null && typeof(device.events[eventIndex].name) === "string")
				{
					self.emit(device.events[eventIndex].name, param);
				}
			}
		});
}

util.inherits(AquilaDevice, events.EventEmitter);

var _manager = null;

var AquilaDevices = function(manager, devices)
{
	Array.call(this);
	var self = this;
	for(var d = 0; d < devices.length; d++)
	{
		self.push(new AquilaDevice(manager, devices[d]));
	}
	_manager = manager;
};

util.inherits(AquilaDevices, Array);

AquilaDevices.prototype.action = function(action, param)
{
	var self = this;
	for(var i = 0; i < self.length; i++)
	{
		var naction = null;
		if(typeof(action) === "string")
		{
			// Search the number of the action
			for(var j = 0; j < self[i].actions.length; j++)
			{
				if(self[i].actions[j].name === action)
				{
					naction = self[i].actions[j].n;
					continue;
				}
			}
		}
		else
		{
			naction = action;
		}
		
		if(naction !== null) _manager.requestAction(self[i]._id, naction, param);
	}
};

AquilaDevices.prototype.on = function(event, listener)
{
	for(var d = 0; d < this.length; d++)
	{
		this[d].on(event, listener);
	}
};

AquilaDevices.prototype.addListener = function(event, listener)
{
	this.on(event, listener);
};

AquilaDevices.prototype.once = function(event, listener)
{
	for(var d = 0; d < this.length; d++)
	{
		this[d].once(event, listener);
	}
};

AquilaDevices.prototype.removeListener = function(event, listener)
{
	for(var d = 0; d < this.length; d++)
	{
		this[d].removeListener(event, listener);
	}
};

AquilaDevices.prototype.removeAllListeners = function(event)
{
	for(var d = 0; d < this.length; d++)
	{
		this[d].removeAllListeners(event);
	}
};

module.exports = AquilaDevices;