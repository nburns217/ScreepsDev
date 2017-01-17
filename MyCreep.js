function MyCreep(creep) {
	this.creep = creep;
	return this;
}
MyCreep.prototype = {
	get isFull() {
		return this.creep.carryCapacity == _.sum(this.creep.carry);
	},
	get isEmpty() {
		return _.sum(this.creep.carry) == 0;
	},
	get hasEnergy() {
		return this.creep.carry[RESOURCE_ENERGY];
	},
	get isStale() {
		this.incrementMemory("STALE_TIME");
		if(this.getMemory("STALE_TIME") > 30) {
			return true;
		}
		return false;
	},
	get role() {
		return this.getMemory("role");
	},
	get state() {
		return this.getMemory("state");
	},
	getMemory : function(key) { 
		return this.creep.memory[key];
	},
	setMemory : function(key, val) { 
		this.creep.memory[key] = val;
		return this;
	},
	zeroMemory : function(key) { 
		this.creep.memory[key] = 0;
		return this;
	},
	incrementMemory : function(key) {
		if(this.creep.memory[key] == undefined) {
			this.creep.memory[key] = 0;
		}
		if(!_.isNumber(this.creep.memory[key])) {
			return false;
		}
		return ++this.creep.memory[key];
	},
	decrementMemory : function(key) {
		if(this.creep.memory[key] == undefined) {
			this.creep.memory[key] = 0;
		}
		if(!_.isNumber(this.creep.memory[key])) {
			return false;
		}
		return --this.creep.memory[key];
	},
	get roomController() {
		return this.creep.room.controller;
	},
	get roomStorage() {
		return this.creep.room.store;
	},
	get currentRoomName() {
		return this.creep.room.name;
	},
	get pos() {
		return this.creep.pos;
	},
	get room() {
		return this.creep.room;
	},
	get carry() {
		return this.creep.carry;
	},
	get carryCapacity() {
		return this.creep.carryCapacity;
	},
	withdraw: function(a,b,c) {
		return this.creep.withdraw(a,b,c);
	},
	drop: function(a,b) {
		return this.creep.drop(a,b);
	},
	pickup: function(a,b) {
		return this.creep.pickup(a,b);
	},
	transfer: function(a,b,c) {
		return this.creep.transfer(a,b,c);
	},
	moveTo: function(a) {
		return this.creep.moveTo(a);
	},
	upgradeController : function(a) {
		return this.creep.upgradeController(a);
	},
	harvest : function(s) {
		return this.creep.harvest(s);
	},
	build : function(s) {
		return this.creep.build(s);
	},
	repair : function(s) {
		return this.creep.repair(s);
	}
}
module.exports = MyCreep;