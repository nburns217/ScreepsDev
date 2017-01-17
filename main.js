require("Prototype.Room"); 
Memory.lastMessage = "";
var RoomController = require("RoomController");
global.json = function(o) {
	var m = JSON.stringify(o);
	if(m !== Memory.lastMessage) {
		console.log(m);
	}
	Memory.lastMessage = m;
}
global.printMessage = function(m) {
	if(m !== Memory.lastMessage) {
		console.log(m);
	}
	Memory.lastMessage = m;
}
module.exports.loop = function() {
	RoomController.updateRoomCache();
	var theDead = clearMemoryOfDeadCreeps();
	if(theDead.length) {
		RoomController.creepsDied(theDead);
	}
	RoomController.run();
}
function clearMemoryOfDeadCreeps() {
	var deadCreeps = [];
	for(let name in Memory.creeps) {
        if(Game.creeps[name] == undefined) {
        	deadCreeps.push(name);
            delete Memory.creeps[name];
        }
    }
    return deadCreeps;
}