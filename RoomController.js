var RoomHandler = require("RoomHandler");
var RoomController = {
	unOwnedRooms: {},
	ownedRooms : {},
	run: function() {
		// this.updateRoomCache();
		_.each(this.ownedRooms, (rh) => rh.init() && rh.run());
	},
	creepsDied : function(creepNames) {
		_.each(this.ownedRooms, (rh) => rh.clearDead(creepNames));	
	},
	updateRoomCache : function() {
		for(var roomName in Game.rooms) {
			var room = Game.rooms[roomName];
			//Check if exists and is not owned yet
			if(this.unOwnedRooms[roomName]) {
				// console.log("[[REGISTERED NOT OWNED]]");
				if(room.isMine()) {
					delete this.unOwnedRooms[roomName];
					this.ownedRooms[roomName] = new RoomHandler(roomName, room);
				}
			}
			else if (this.ownedRooms[roomName]) {
				// console.log("[[REGISTERED OWNED]]");
				if(!room.isMine()) {
					delete this.ownedRooms[roomName];
					this.unOwnedRooms[roomName] = new RoomHandler(roomName, room);
				}	
			}
			else if(room.isMine()) {
				// console.log("[[OWNED]]");
				this.ownedRooms[roomName] = new RoomHandler(roomName, room);
			}
			else {
				// console.log("[[NOT OWNED]]");
				this.unOwnedRooms[roomName] = new RoomHandler(roomName, room);
			}

			// json(room.isMine());
		}
		// json({"owned":Object.keys(this.ownedRooms).length,
		// 		"unowned" : Object.keys(this.unOwnedRooms).length});
		// console.log(JSON.stringify(this));
	}
}

module.exports = RoomController;