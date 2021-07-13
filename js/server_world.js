var players = [];

function Player(){
	this.playerId = players.length;
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

var addPlayer = (id)=>{
	var player = new Player();
	player.playerId = id;
	players.push(player);

	return player;
};

var removePlayer = (player)=>{
	var index = players.indexOf(player);

	if(index > -1){
		players.splice(index,1);
	}
};

var updatePlayerData = (data)=>{
	var player = playerForId(data.playerId);
	player.x = data.x;
	player.y = data.y;
	player.z = data.z;

	return player;
};

var playerForId = (id)=>{
	var player;
	for(var i = 0; i < players.length; i++){
		if(players[i].playerId === id){
			player = players[i];
			break;
		}
	}
	return player;
};

module.exports.players = players;
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
module.exports.updatePlayerData = updatePlayerData;
module.exports.playerForId = playerForId;