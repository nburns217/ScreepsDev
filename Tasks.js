var tasks = {};
tasks["harvest"] = function (creep) {
	if(creep.carryCapacity != _.sum(creep.carry)) {
		var source = null;
		if(creep.getMemory("source")) {
			source = Game.getObjectById(creep.getMemory("source"));
		}
		if(source == undefined || source == null) {
			source = creep.pos.findClosestByPath(FIND_SOURCES, {
				filter: (s) => (s.energy == 0 && s.ticksToRegeneration < 10) || s.energy > 0
			});
		}

		if(source) {
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source);
			}
			return true;
		}
	}
	return false;
}
tasks["fillSpawnOrExtension"] = function(creep) {
	if(creep.hasEnergy) {
		var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    		filter: (s) => (	s.structureType == STRUCTURE_SPAWN 
    						|| 	s.structureType == STRUCTURE_EXTENSION
							)
    						&& s.energy < s.energyCapacity
    	});
    	if(structure) {
			if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(structure);
			}	
			return true;
    	}
    }
	return false;
}
tasks["upgrade"] = function(creep) {
	if(creep.hasEnergy) {
		if(creep.roomController) {
			if ( creep.upgradeController(creep.roomController) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.roomController);
	        }
	        return true;	
		}
		
    }
	return false;
}
tasks["build"] = function(creep) {
	if(creep.hasEnergy) {
		var construcSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if(construcSite) {
        	if ( creep.build(construcSite) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(construcSite);
	        }
	        return true;
        }
    }
	return false;
}
tasks["repair"] = function(creep) {
	if(creep.hasEnergy) {
		var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
           filter: function(object){
               if(object.structureType == STRUCTURE_WALL) {
               		if(object.hits < (object.hitsMax * .0001)) {
               			return true;
               		}
               		return false;
               }if(object.structureType == STRUCTURE_RAMPART) {
               		if(object.hits < 500000){
               			return true;
               		}
               		return false;
               }
               if(object.hits < object.hitsMax * 0.75) {
                return true;
              }
              return false;
           } 
        })
        if(structure) {
        	if ( creep.repair(structure) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(structure);
	        }
	        return true;
        }
    }
	return false;
}
tasks["fillFromStorage"] = function(creep) {
	if(creep.roomStore && creep.roomStore.store[RESOURCE_ENERGY] !== 0) {
		var storage = creep.roomStore;
		if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
		}
		return true;
	}
	return false;
}
tasks["fillStorage"] = function(creep) {
	if(creep.roomStore && creep.roomStore.store[RESOURCE_ENERGY] !== 0) {
		var storage = creep.roomStore;
		if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
		}
		return true;
	}
	return false;
}
tasks["fillFromContainer"] = function(creep) {
	if(!creep.isFull){
		var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
		});
		if(container) {
			if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

	            creep.moveTo(container);
			}
			return true;
		}
	}
	return false;
}
tasks["fillContainer"] = function(creep) {
	if(!creep.isEmpty) {
		var container = creep.pos.findInRange(FIND_STRUCTURES, 2, {
			filter: function(s) {
				return s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity
			}
			// filter: (s) => s.structureType == STRUCTURE_CONTAINER // && _.sum(s.store) < s.storeCapacity
		});
		if(container.length) {
			var xfer = creep.transfer(container[0], RESOURCE_ENERGY);
			if(xfer == ERR_NOT_IN_RANGE) {
				creep.moveTo(container[0]);
			}
			return true;
		}
	}
	return false;
}
tasks["findDroppedEnergy"] = function(creep) {
	var targets = creep.room.find(FIND_DROPPED_RESOURCES, {
		filter: (r) => r.resourceType == RESOURCE_ENERGY
	});
	if(targets.length) {
		if(creep.pickup(targets[0]) === ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0]);
		}
		return true;
	} 
	return false;
}
tasks["dropResources"] = function(creep) {
	if(creep.hasEnergy) {
		creep.drop(RESOURCE_ENERGY);
		return true;
	} 
	return false;
}
tasks["moveToTargetRoom"] = function(creep) {
	var target = creep.getMemory("longRangeTarget");
	if(target && target.roomName) {
		if(creep.currentRoomName != target.roomName) {
			var exit = creep.room.findExitTo(target.roomName);
			creep.moveTo(creep.pos.findClosestByRange(exit));
			return true;
		}
	}
	return false;
}
tasks["moveToHomeRoom"] = function(creep) {
	var target = creep.getMemory("home");
	if(target) {
		if(creep.currentRoomName != target) {
			var exit = creep.room.findExitTo(target);
			creep.moveTo(creep.pos.findClosestByRange(exit));
			return true;
		}
	}
	return false;
}
module.exports = tasks;