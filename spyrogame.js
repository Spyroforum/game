//Variables:
//General:
var canvas = document.getElementById("gamecanvas"), ctx = canvas.getContext("2d");
var gameLoop, screenWidth, screenHeight;

//Keyboard keys
var leftKey, upKey, rightKey, downKey, aKey, sKey;

//Objects
var objSpyro = null;
var objEnemy = null;
var objCamera = null;//NEW(sheep)
var objLevel = null;//NEW(sheep)
var gravity = 1.5;


//Start the game
gameInit();


//Below here are the game functions:
function gameInit(){
	//Set the game screen size
	screenWidth = 640;
	screenHeight = 360;
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	
	//Add keyboard keys to "listen" for
	leftKey = keyboard.addKey(37);
	upKey = keyboard.addKey(38);
    rightKey = keyboard.addKey(39);
	downKey = keyboard.addKey(40);
	aKey = keyboard.addKey(ord("A"));
	sKey = keyboard.addKey(ord("S"));
	
	//Create block/grid terrain
	//NEW(sheep)test grid level structure, just for demonstration
	objLevel=new GridLevel(64,20,11);
	objLevel.grid=[
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1],
		[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
		[1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,1],
		[0,1,1,1,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,1],
		[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1]
	]
	//NEW(sheep)Create camera
	objCamera = new Camera();//NEW(sheep)
	
	//Create Spyro
	objSpyro = new Spyro();
	objSpyro.level = objLevel;//NEW(sheep)
	objCamera.target = objSpyro;//NEW(sheep)
    objEnemy = new Enemy();
    objEnemy.spyro = objSpyro;
	
	//Start the game loop
	gameLoop = this.setInterval("gameStep()", 1000/30);
}

function gameStep(){
	//Clear the canvas with a pink background colour
	ctx.setTransform(1,0,0,1,0,0);
	ctx.fillStyle = 'rgb(255,150,255)';
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	
	//Make Spyro do stuff
	objSpyro.step();
	objEnemy.step();
	objCamera.step();
	objCamera.setView(ctx);
	objLevel.draw(0,0);//NEW(sheep)
	objSpyro.draw();
    objEnemy.draw();
	
	keyboard.update();//Make keys go to the state of just being held or untouched after being pressed or released
    mouse.update();
}
