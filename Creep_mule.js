module.exports = {
	active: [
		"fillTower",
		"fillStorage",
		"fillSpawnOrExtension"
	],
	inactive: [
		"findDroppedEnergy",
		"fillFromContainer"
	],
	transitionState: function(creep) {
		if(creep.isFull) {
			creep.setMemory("state", "active");
		}
		else if (creep.isEmpty){
			creep.setMemory("state", "inactive");
		}
		else {
			if(creep.isStale) {
				creep.setMemory("state", creep.getMemory("state") == "active" ? "inactive" : "active");
				creep.zeroMemory("STALE_TIME");
			}
		}
	}
}