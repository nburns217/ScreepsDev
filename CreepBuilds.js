var creepTypes = {
	harvester: {
		body: [
			{ part: WORK, 	ratio: 2 },
			{ part: CARRY, 	ratio: 1 },
			{ part: MOVE, 	ratio: 1 }
		],
		maxViableComplexity : 8
	},
	upgrader: {
		body: [
			{ part: WORK, 	ratio: 1 },
			{ part: CARRY, 	ratio: 1 },
			{ part: MOVE, 	ratio: 1 }
		],
		maxViableComplexity : 8
	},
	builder: {
		body: [
			{ part: WORK, 	ratio: 1 },
			{ part: CARRY, 	ratio: 2 },
			{ part: MOVE, 	ratio: 2 }
		],
		maxViableComplexity : 3,
		shouldCreate: function(room) {
			
		}
	},
	repairer: {
		body: [
			{ part: WORK, 	ratio: 1 },
			{ part: CARRY, 	ratio: 2 },
			{ part: MOVE, 	ratio: 2 }
		],
		maxViableComplexity : 3,
		shouldCreate: function(room) {
			
		}
	},
	mule: {
		body: [
			{ part: CARRY, 	ratio: 3 },
			{ part: MOVE, 	ratio: 1 }
		],
		maxViableComplexity : 5,
		shouldCreate: function(room) {
			
		}
	}
}
for(var typeName in creepTypes) {
	var obj = creepTypes[typeName];
	var complexityCost = 0;
	for(let i in obj.body) {
		var partConfig = obj.body[i];
		complexityCost += BODYPART_COST[partConfig.part] * partConfig.ratio;
	}
	obj.complexityCost = complexityCost;
}

module.exports = {
	bodyConfig : function(type, complexity) {
		if(creepTypes[type] == undefined) {
			return;
		}
		var bodySetup = creepTypes[type].body;
		var config = [];
		for(var i = 0; i < complexity; i++) {
			for(var j in bodySetup) {
				var partConfig = bodySetup[j];
				for(var k = 0; k < partConfig.ratio; k++) {
					config.push(partConfig.part);
				}
			}
		}
		return config;
	},
	complexityCost : function(type, complexity) {
		if(complexity == undefined) {
			complexity = 1;
		}
		if(creepTypes[type] == undefined) {

			return;
		}
		return creepTypes[type].complexityCost * complexity;
	},
	maxComplexity: function(type, avalEnergy) {
		var compCost = this.complexityCost(type, 1);
		var comp = Math.floor(avalEnergy / compCost);
		if(comp > creepTypes[type].maxViableComplexity) {
			return creepTypes[type].maxViableComplexity;
		}
		return comp;
	}
}