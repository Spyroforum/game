
function Spyro(){
    this.x = 100;
	this.y = 100;
	this.xspeed = 0;
	this.yspeed = 0;
    this.maxXSpeed = 15;
	this.facing = -1;
	this.sprite = sprSpyro;
	this.frame = 0;
	this.animSpeed = 0.25;
	this.rotation = 0;
	this.radius = 32;
	this.acceleration = 3;
	
	this.jump = function(){
	    this.yspeed -= 17;
		audio.playSound(sndJump, 1, false);
	}

	this.step = function(){
	
		//Keyboard input and controls
		
		//Horizontal movement
		//(Don't let him accelerate past his max xspeed by walking, but still allow for higher speeds given from the environment)
		if( keyboard.isHeld(leftKey) ){
			this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);
			this.facing = -1;
		}
		if( keyboard.isHeld(rightKey) ){
			this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
			this.facing = 1;
		}
		
		//Vertical movement
		this.yspeed += gravity;
		
		//Stop in mid-air when holding space
		if( keyboard.isHeld(spaceKey) ){
			this.xspeed = 0;
			this.yspeed = 0;
		}
		
		//Movement and collision with terrain
		var isCollision = objectXlevelCollision(this);
		if( isCollision )
		{
		    this.xspeed = slowDown( this.xspeed, 1.5 );
		    if( keyboard.isPressed(upKey) ) this.jump();
		}
		
		this.frame += this.animSpeed;
	}
	
	this.draw = function(){
        //Make Spyro draw himself
        drawSprite(context, this.sprite, this.frame, this.x, this.y, -this.facing, 1, this.rotation);
		context.beginPath();
		context.arc(this.x,this.y,32,0,2*Math.PI);
		context.stroke();
		this.sprite = sprSpyro;
    }
}
