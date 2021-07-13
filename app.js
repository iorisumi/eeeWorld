var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var world = require('./api/server_world.js');

app.get('/', (req,res)=>{
	res.sendFile(__dirname + '/index.html');
});

app.get('/js/client_world.js', (req,res)=>{
	res.sendFile(__dirname + '/js/client_world.js');
});
app.get('/js/three.min.js', (req,res)=>{
	res.sendFile(__dirname + '/js/three.min.js');
});

app.get('/js/OBJLoader.js', (req,res)=>{
	res.sendFile(__dirname + '/js/OBJLoader.js');
});

app.get('/css/style.css', (req,res) => {
	res.sendFile(__dirname + '/css/style.css');
});
app.get('/css/reset.css', (req,res) => {
	res.sendFile(__dirname + '/css/reset.css');
});

io.on('connection', (socket)=>{
	console.log('a user connected');

	var id = socket.id;
	world.addPlayer(id);

	var player = world.playerForId(id);
	socket.emit('createPlayer', player);

	socket.broadcast.emit('addOtherPlayer', player);

	socket.on('requestOldPlayers', ()=>{
		for(var i = 0; i < world.players.length; i++){
			if(world.players[i].playerId != id){
				socket.emit('addOtherPlayer', world.players[i]);
			}
		}
	});

	socket.on('updatePosition', (data)=>{
		var newData = world.updatePlayerData(data);
		socket.broadcast.emit('updatePosition', newData);
	});

	socket.on('disconnect', ()=>{
		console.log('user disconnected');
		io.emit('removeOtherPlayer', player);
		world.removePlayer(player);
	});
});

var port = process.env.PORT || 8080;

http.listen(port, ip_address, ()=>{
	console.log("server_port" + port);
});