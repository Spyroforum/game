//Variables:
//General:
var canvas = document.getElementById("gamecanvas"), context = canvas.getContext("2d");
var gameLoop, screenWidth, screenHeight;

//Keyboard keys
var leftKey, upKey, rightKey, downKey, aKey, sKey;


//Objects
var objSpyro = null;
var objEnemy = null;
var objSparx = null;
var objCamera = null;
var objLevel = null;
var objTerrain = null;
var gravity = 1.5;

//Sprites
var sprSpyro = resources.addSprite("graphics/spyro.png", 2, 64, 64, 32, 32, 0);
var sprSpyroHurt = resources.addSprite("graphics/spyroHurt.png", 2, 64, 64, 32, 32, 0);
var sprEnemy = resources.addSprite("graphics/enemy.png", 1, 64, 64, 32, 32, 0);
var sprSparx = resources.addSprite("graphics/sparx.png", 6, 32, 32, 16, 16, 0);
//Sounds
var sndRumble = resources.addSound("sounds/rumble.ogg");
var sndJump = resources.addSound("sounds/jump.ogg");

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
    //test grid level structure, just for demonstration
	objTerrain = new GridTerrain(64, 20, 11);
	objTerrain.grid = [
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
    objCamera = new Camera();
	
	//Create Spyro
	objSpyro = new Spyro();
    objSpyro.terrain = objTerrain;
    objCamera.target = objSpyro;
    objEnemy = new Enemy();
    objEnemy.spyro = objSpyro;
    objSparx = new Sparx();
    objSparx.spyro = objSpyro;
	
	//Start the game loop
	gameLoop = this.setInterval("gameStep()", 1000 / 30);
}

function gameStep(){
	if( resources.loaded ){
		//Clear the canvas with a pink background colour
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = 'rgb(255, 150, 255)';
        context.fillRect(0, 0, screenWidth, screenHeight);
		
		//Make Spyro do stuff
		objSpyro.step();
		objEnemy.step();
        objSparx.step();
		objCamera.step();
        objCamera.setView(context);
        objTerrain.draw(0, 0);
		objSpyro.draw();
		objEnemy.draw();
        objSparx.draw();
		
		keyboard.update();//Make keys go to the state of just being held or untouched after being pressed or released
		mouse.update();
	} else {
		resources.loadStep();
	}
}
