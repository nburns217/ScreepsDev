var MyCreep = require("MyCreep");
var taskSets = {};
taskSets['harvester'] = require("Creep_harvester");
taskSets['upgrader'] = require("Creep_upgrader");
taskSets['builder'] = require("Creep_builder");
taskSets['repairer'] = require("Creep_repairer");
taskSets['mule'] = require("Creep_mule");

var tasks = require("Tasks");

module.exports = function(creep) {
	var myCreep = new MyCreep(creep);
	var taskSet = taskSets[myCreep.role];
	for(var i in taskSet[myCreep.state]) {
		var taskKey = taskSet[myCreep.state][i];
		if(tasks[taskKey] && tasks[taskKey](myCreep)) {
			return;
		}
	}
	taskSet.transitionState(myCreep);
}