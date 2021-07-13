var Colors = {
	pink:0xD9308B,
	white:0xF3F2F3,
	green:0x9CC11C,
	red:0xD92B3A,
	yellow:0xF6C917,
	blue:0x0F6EC1,
	brown:0x8C4E03,
	black:0x222222,
};

var scene, camera, fieldOfView, aspectRatio, naerPlane, farPlane, HEIGHT, WIDTH, renderer, container;
var right = false, left = false, up = false, down = false;
var player, playerId, moveSpeed;
var playerData;
var otherPlayers = [], otherPlayersId = [];
var exhibition_1 = document.getElementById('exhibition_1');
var exhibition_2 = document.getElementById('exhibition_2');
var exhibition_3 = document.getElementById('exhibition_3');
var exhibition_4 = document.getElementById('exhibition_4');
var exhibition_5 = document.getElementById('exhibition_5');
var exhibition_6 = document.getElementById('exhibition_6');
var exhibition_7 = document.getElementById('exhibition_7');
var zoom_1 = false, zoom_2 = false, zoom_3 = false, zoom_4 = false, zoom_5 = false, zoom_6 = false, zoom_7 = false;

function init() {
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// add the objects
	createMonitor();
	createAuthor();
	createSky();
	createForest();
	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('keydown', keydownFunc, false);
	document.addEventListener('keyup', keyupFunc, false);
	// start a loop that will update the objects' positions 
	// and render the scene on each frame
	loop();
}

function loop(){
  render();
  requestAnimationFrame(loop);
}

function createScene(){
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	//シーンの作成
	scene = new THREE.Scene();
	//霧
	scene.fog = new THREE.Fog(0xb8fdfa, 100, 950);

	//カメラの作成
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	naerPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
			fieldOfView,
			aspectRatio,
			naerPlane,
			farPlane
		);

	//カメラの位置
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 70;

	//レンダラーの作成
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

	renderer.setSize(WIDTH,HEIGHT);
	renderer.shadowMap.enabled = true;
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize(){
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH,HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights(){
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	shadowLight.position.set(150,350,350);
	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

var createPlayer = (data)=>{
	playerData = data;
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.yellow,
		transparent:true,
		opacity: .6,
		shading: THREE.FlatShading,
	});
	var objLoader = new OBJLoader();
	objLoader.load('model/mob.obj', (objecr) => {
		object.position.x = 0;
		object.position.y = 8;
		object.position.z = 50;
		object.scale = 10;
    	scene.add(root);
  	});

	//var geom = new THREE.SphereGeometry(10,16,16);
	
	// player = new THREE.Mesh(geom, mat);
	// player.receiveShadow = true;

	// player.position.x = 0;
	// player.position.y = 8;
	// player.position.z = 50;

	// playerId = data.playerId;

	// updateCameraPosition();

	// scene.add(player);
	// camera.lookAt( player.position );
};

var updateCameraPosition = () =>{
	if(zoom_1){
		camera.position.x = player.position.x;
		camera.position.y = player.position.y + 50;
		camera.position.z = player.position.z + 80;
	}else if(zoom_2){
		camera.position.x = player.position.x - 30;
		camera.position.y = player.position.y + 40;
		camera.position.z = player.position.z + 80;
	}
	else{
		camera.position.x = player.position.x;
		camera.position.y = player.position.y + 80;
		camera.position.z = player.position.z + 200;
	}
};

var updatePlayerPosition = (data) =>{
	var somePlayer = playerForId(data.playerId);
	somePlayer.position.x = data.x;
	somePlayer.position.y = data.y;
	somePlayer.position.z = data.z;
};

var updatePlayerData = () =>{
	playerData.x = player.position.x;
	playerData.y = player.position.y;
	playerData.z = player.position.z;
	
	// console.log(player.position.x);
	// console.log(player.position.z);
	createArea(-50,50,-50,50,exhibition_1);
	createArea(-300,-200,-300,-200,exhibition_2);
}


var addOtherPlayer = (data) =>{
	var geom = new THREE.SphereGeometry(10,16,16);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.red,
		transparent:true,
		opacity: .6,
		shading: THREE.FlatShading,
	});
	var otherPlayer = new THREE.Mesh(geom, mat);
	otherPlayer.receiveShadow = true;

	otherPlayer.position.x = data.x;
	otherPlayer.position.y = data.y;
	otherPlayer.position.z = data.z;

	otherPlayersId.push(data.playerId);
	otherPlayers.push(otherPlayer);
	scene.add(otherPlayer);
};

var removeOtherPlayer = (data) =>{
	scene.remove(playerForId(data.playerId));
};

var playerForId = (id) => {
	var index;
	for(var i = 0; i < otherPlayersId.length; i++){
		if(otherPlayersId[i] == id){
			index = i;
			break;
		}
	}
	return otherPlayers[index];
}
var checkKeyStates = ()=>{
	if(left){
		player.position.x -= 1;
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	};
	if(right){
		player.position.x += 1;
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	};
	if(up){
		player.position.z -= 1;
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	};
	if(down){
		player.position.z += 1;
		updatePlayerData();
		socket.emit('updatePosition', playerData);
	};
}

Author = function(){
	this.mesh = new THREE.Object3D();
	var geom = new THREE.BoxGeometry(20,20,20);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
	});
	var m = new THREE.Mesh(geom,mat);
	m.position.x = -250;
	m.position.z = -250;
	m.castShadow = true;
	m.receiveShadow = true;
	this.mesh.add(m)
}

Monitor = function(){
	this.mesh = new THREE.Object3D();
	var geomBezel = new THREE.BoxGeometry(100,50,5);
	var matBezel = new THREE.MeshPhongMaterial({
		color:Colors.black,
	});

	var bezel = new THREE.Mesh(geomBezel,matBezel);
	bezel.position.y = 40;
	bezel.castShadow = true;
	bezel.receiveShadow = true;
	this.mesh.add(bezel);

	var geomDisplay = new THREE.BoxGeometry(95,46,4);
	var matDisplay = new THREE.MeshPhongMaterial({
		color:Colors.white,
	});
	var display = new THREE.Mesh(geomDisplay,matDisplay);
	display.position.y = 40;
	display.position.z = 1;
	this.mesh.add(display);

	var geomArm = new THREE.BoxGeometry(10,30,5);
	var arm = new THREE.Mesh(geomArm,matBezel);
	arm.position.z = -4;
	arm.position.y = 10;
	this.mesh.add(arm);

	var geomStand = new THREE.BoxGeometry(30,2,30);
	var stand = new THREE.Mesh(geomStand,matBezel);
	this.mesh.add(stand);

}

Tree = function(){
	this.mesh = new THREE.Object3D();
	var geomLeaf = new THREE.BoxGeometry(10,10,10);
	var matLeaf = new THREE.MeshPhongMaterial({
		color:Colors.green,
	});

	for(var i = 0; i < 8; i++){
		var m = new THREE.Mesh(geomLeaf, matLeaf);
		m.rotation.x = 90 * i;
		if(i<1){
			m.position.y = 50;
		}else if(i<4){
			m.position.y = 40;
			m.position.x = Math.cos(90*i) * 5;
			m.position.z = Math.sin(90*i) * 5;

		}else{
			m.position.y = 30;
			m.position.x = Math.cos(80*i) * 10;
			m.position.z = Math.sin(80*i) * 10;
		}
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;
		
		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}

	var geomWood = new THREE.BoxGeometry(5,40,5);
	var matWood = new THREE.MeshPhongMaterial({
		color:Colors.brown,
	});
	var wood = new THREE.Mesh(geomWood,matWood);
	wood.position.y = 20;
	this.mesh.add(wood);
}

Forest = function(){
	this.mesh = new THREE.Object3D();
	this.nTrees = 25;

	for(var i = 0; i < this.nTrees; i++){
		var c = new Tree();
		c.mesh.position.z = -100 - Math.random()*800;
		c.mesh.position.x = -100 - Math.random()*800;

		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		this.mesh.add(c.mesh);
	}
}
Cloud = function(){
	this.mesh = new THREE.Object3D();
	var geom = new THREE.BoxGeometry(20,20,20);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,
	});

	var nBlocks = 3 + Math.floor(Math.random()*3);
	for(var i = 0; i< nBlocks; i++){
		var m = new THREE.Mesh(geom, mat);

		m.position.x = i * 15;
		m.position.y = Math.random() * 10;
		m.position.z = Math.random() * 10;
		m.rotation.x = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;

		var s = .1 + Math.random() * 0.9;
		m.scale.set(s,s,s);

		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}
}

Sky = function(){
	this.mesh = new THREE.Object3D();
	this.nClouds = 25;

	var stepAngle = Math.PI * 2 / this.nClouds;

	for(var i = 0; i< this.nClouds; i++){
		var c = new Cloud();

		//var a = stepAngle + i;
		var h = 680 + Math.random()*200;

		c.mesh.position.y =  h;
		// c.mesh.position.x = Math.cos(a) * h;

		//c.mesh.rotation.z = a + Math.PI/2;
		c.mesh.position.z = 1000 - Math.random()*2000;
		c.mesh.position.x = 1000 - Math.random()*2000;

		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		this.mesh.add(c.mesh);
	}
}
var monitor;
function createMonitor(){
	monitor = new Monitor();
	scene.add(monitor.mesh);
}
var author;
function createAuthor(){
	author = new Author();
	scene.add(author.mesh);
}
var forest;
function createForest(){
	forest = new Forest();
	scene.add(forest.mesh);
}

var sky;
function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

function render(){
	if(player){
		updateCameraPosition();
		checkKeyStates();
	}
	renderer.render(scene, camera);
}

function createArea(x1,x2,z1,z2,id){
	if(player.position.x < x2 && player.position.x > x1 && player.position.z < z2 && player.position.z > z1){
		removeClass(id);
		if(id == exhibition_1) zoom_1=true;
		if(id == exhibition_2) zoom_2=true;
		if(id == exhibition_3) zoom_3=true;
		if(id == exhibition_4) zoom_4=true;
		if(id == exhibition_5) zoom_5=true;
		if(id == exhibition_6) zoom_6=true;
		if(id == exhibition_7) zoom_7=true;
	}else{
		addClass(id);
		if(id == exhibition_1) zoom_1=false;
		if(id == exhibition_2) zoom_2=false;
		if(id == exhibition_3) zoom_3=false;
		if(id == exhibition_4) zoom_4=false;
		if(id == exhibition_5) zoom_5=false;
		if(id == exhibition_6) zoom_6=false;
		if(id == exhibition_7) zoom_7=false;
	}
}

function removeClass(id){
	if(id.classList.contains('close_content')){
		id.classList.remove('close_content');
	}
}
function addClass(id){
	if(!id.classList.contains('close_content')){
		id.classList.add('close_content');
	}
}

function normalize(v, vmin, vmax, tmin, tmax){
	var nv = Math.max(Math.min(v,vmax),vmin);
	var dv = vmax-vmin;
	var pc = (nv - vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

var mousePos = { x:0, t:0};

function handleMouseMove(event){
	var tx = -1 + (event.clientX / WIDTH) * 2;
	var ty = 1 - (event.clientY / HEIGHT) * 2;
	mousePos = {x:tx, y:ty};
}

function keydownFunc(event){
	var key_code = event.keyCode;
	//左
	if(key_code == 37){
		left = true;
	}
	//上
	if(key_code == 38){
		up = true;
	}
	//右
	if(key_code == 39){
		right = true;
	}
	//下
	if(key_code == 40){
		down = true;
	}
}

function keyupFunc(event){
	var key_code = event.keyCode;
	//左
	if(key_code == 37){
		left = false;
	}
	//上
	if(key_code == 38){
		up = false;
	}
	//右
	if(key_code == 39){
		right = false;
	}
	//下
	if(key_code == 40){
		down = false;
	}
}