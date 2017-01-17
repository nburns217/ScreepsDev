var MyCreep = require("MyCreep");
var CreepBuilds = require('CreepBuilds');
var CreepRunner = require('CreepRunner');
function RoomHandler(roomName) {
	var self = this;
	self.name = roomName;
	
	// self.room.memory.creeps = undefined;
	// Memory.rooms[self.name] = {creeps: {}};
	self.creepTypes = {
		'harvester' : {
			min : 3,
			maxComplexity: 1
		},
		'mule': {
			min: 3,
			maxComplexity: 3
		},
		'upgrader': {
			min: 4,
			maxComplexity: 1
		},
		'builder': {
			min: 4,
			maxComplexity: 1
		},
		'repairer': {
			min: 2,
			maxComplexity: 1
		}
	}

	self.remoteTargets = {
		"W7N3" : {
			"harvester" : 1,
			"builder" : 0,
			"repairer" : 0
		}
	}
	
	this.init();
	// json({a: "AFTER INIT", creeps: this.getRoomMemory().creeps});

	return self;
}
RoomHandler.prototype.init = function() {
	var self = this;
	self.room = Game.rooms[self.name];
	self.controller = self.room.controller;
	self.storage = self.room.storage;
	self.terminal = self.room.terminal;
	self.spawn = self.room.find(FIND_STRUCTURES, {
		filter: (s) => s.structureType == STRUCTURE_SPAWN
	})[0];

	if(self.storage || self.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER}).length) {
		self.creepTypes['mule'].min = 2;
	}
	else {
		self.creepTypes['mule'].min = 0;	
	}
	if(self.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
		self.creepTypes['builder'].min = 4;
	}
	else {
		self.creepTypes['builder'].min = 0;
	}
	// json(self.creepTypes);

	_.each(Game.creeps, function(creep, name, creeps) {
		if(creep.memory.home == self.name) {
			self.addCreep(creep.memory.role, name, new MyCreep(creep));
		}
	});
	// self.reportInfo();
	return self;
}
RoomHandler.prototype.reportInfo = function() {
	var self = this;
	function formatRow(obj) {
		var row = "<tr>";
		for(var i in obj) {
			row += "<td>"+obj[i]+"\t</td>";
		}
		row += "</tr>";
		return row;
	}
	
	var mem = self.getRoomMemory();
	var table = "<table><tr><td colspan='"+Object.keys(mem.creeps).length+"'>Room: "+self.name+"\t</td></tr>";
	table += formatRow(["Type","Count","Expected"]);
	// table += formatRow(Object.keys(mem.creeps));
	var counts = [];
	for(var i in mem.creeps) {
		
	}
	table += formatRow(counts);
	console.log(table);
}
RoomHandler.prototype.run = function() {
	// json({room: this.name, action: 'run'});
	var roomMemory = this.getRoomMemory();
	// json(roomMemory);
	for(var type in roomMemory.local.creeps) {
		for(j in roomMemory.local.creeps[type]) {
			var creep = Game.creeps[j];
			if(creep) {
				new CreepRunner(creep);	
			}
			else {
				this.clearDead([j]);
			}
		}
	}
	this.spawnCreep();
	// this.reportInfo();
	return this;
}
RoomHandler.prototype.spawnCreep = function() {
	var creepNeeded = this.creepNeeded();
	if(creepNeeded) {
		var type = creepNeeded.type;
		var complexity = creepNeeded.complexity;

		var roomEnergy = this.energyStats();
		var maxComplexity = CreepBuilds.maxComplexity(type, roomEnergy.current);
		var bodyConfig = CreepBuilds.bodyConfig(type, maxComplexity);
		if(roomEnergy.current >= CreepBuilds.complexityCost(type, maxComplexity)) {
			if(this.spawn.spawing == null) {
				var creepName = this.spawn.createCreep(bodyConfig, undefined, {
					home : this.name,
					longRangeTarget : {
						roomName: creepNeeded.roomName,
						target: false
					},
					source: null,
					role : type,
					state: "inactive"
				});
				if(_.isString(creepName)) {
					this.addCreep(type, creepName, new MyCreep(Game.creeps[creepName]));
				}
				else {
					console.log("[[SPAWN CREEP ERROR]]: " + creepName);
				}
			}
		}
	}
}
RoomHandler.prototype.setRoomMemory = function(mem) {
	Memory.rooms[this.name] = mem;
}
RoomHandler.prototype.getRoomMemory = function() {
	var mem = _.extend({},
		Memory.rooms[this.name]
	);
	if(mem.creeps) {
		var t = _.extend({}, mem.creeps);
		delete mem.creeps;
		mem.local = {};
		mem.remote = {creeps: {}};
		mem.local.creeps = t;
	}

	return mem;
}
RoomHandler.prototype.addCreep = function(type, name, creep) {
	var mem = this.getRoomMemory();
	// json({a: "BEFORE ADD", creeps: mem.creeps});
	var subset = creep.getMemory("longRangeTarget").roomName ? "remote" : "local";
	if(mem[subset].creeps[type] !== undefined) {
		mem[subset].creeps[type][name] = 1;
	}
	else if(mem[subset].creeps[type] === undefined){
		mem[subset].creeps[type] = {};
		mem[subset].creeps[type][name] = 1;
	}
	this.setRoomMemory(mem);

	// json({a: "AFTER ADD", creeps: this.getRoomMemory().creeps});
}
RoomHandler.prototype.clearDead = function(names) {
	var mem = this.getRoomMemory();
	for(var i in mem.local.creeps) {
		for(var name in mem.local.creeps[i]) {
			for(var j in names) {
				var dName = names[j];
				if(name == dName) {
					delete mem.local.creeps[i][name];
				}
			}
		}
	}
	this.setRoomMemory(mem);
	// json({a: "AFTER REMOVE",remove: names, creeps: this.getRoomMemory().creeps});
}
RoomHandler.prototype.creepCount = function(type, subset) {
	if(subset == undefined) {
		subset = "local";
	}
	var mem = this.getRoomMemory();
	return (mem[subset] && mem[subset].creeps[type] !== undefined) ? Object.keys(mem[subset].creeps[type]).length : 0;
}

RoomHandler.prototype.creepNeeded = function() {
	var mem = this.getRoomMemory();
	for(var type in this.creepTypes) {
		var min = this.creepTypes[type].min;
		var maxComplexity = this.creepTypes[type].maxComplexity;
		if(mem.local.creeps[type] == undefined) {
			mem.local.creeps[type] = {};
		}
		var creepsOfType = mem.local.creeps[type];
		if( min && this.creepCount(type, 'local') < min ) {
			json({room: this.roomName, message: type + ' needed ('+this.creepCount(type,'local')+'/'+min+')'});
			return {type: type, complexity: maxComplexity, roomName: null};
		}
	}
	// for(var roomName in this.longRangeTargets) {

	// }
	return false;
}
RoomHandler.prototype.energyStats = function() {
	return {
		max: this.room.energyCapacityAvailable,
		current : this.room.energyAvailable,
		percent : this.room.energyAvailable / this.room.energyCapacityAvailable
	};
}


module.exports = RoomHandler;