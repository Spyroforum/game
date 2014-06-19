function Spyro(){
    this.x = 100;
	this.y = 100;
	this.xspeed = 0;
	this.yspeed = 0;
	this.facing = -1;
	this.sprite = loadSprite("graphics/spyro.png", 2, 64, 64, 32, 32, 0);
	this.frame = 0;
	this.animSpeed = 0.25;
	this.rotation = 0;
	this.level = null;//NEW(sheep)
	
	this.step = function(){
	    with (this){
		    //Movement and facing direction
		    if(keyboard.isHeld(leftKey)){
			    x -= 10;
			    facing = -1;
		    }
		    if(keyboard.isHeld(rightKey)){
			    x += 10;
			    facing = 1;
		    }
			
			//NEW(sheep) collide with level on x axis
			if( level != null ){
				if(level.collideRect(x-32,y-32,64,64)){
					if(facing==-1)
						x = Math.floor((x-32)/level.blockSize+1)*level.blockSize+32;
					else
						x = Math.ceil((x+32)/level.blockSize-1)*level.blockSize-32;
				}
			}
			
		    if(keyboard.isPressed(upKey))
			    yspeed -= 15;
		    //if(keyboard.isHeld(downKey))
			//    y += 10;
		
		    //Change animation speed with the S key, just to show the keyboard.isReleased function
		    if(keyboard.isPressed(sKey))
			    animSpeed = 0.0;
		    else if(keyboard.isReleased(sKey))
			    animSpeed = 0.25;
			
		    frame += animSpeed;
		
		    //Rotate Spyro by pressing the A key
		    if(keyboard.isPressed(aKey))
			    rotation += 45;
			    
			yspeed += gravity;
			y += yspeed;
			
			//NEW(sheep) collide with level on y axis
			if( level != null ){
				if(level.collideRect(x-32,y-32,64,64)){
					if(yspeed<0)
						y = Math.floor((y-32)/level.blockSize+1)*level.blockSize+32;
					else
						y = Math.ceil((y+32)/level.blockSize-1)*level.blockSize-32;
					yspeed = 0;
				}
			}
			/*
			if( y > screenHeight - 32)
			{
			    y = screenHeight - 32;
			    yspeed = 0;
			}
			else if( y < 32 )
			{
			    y = 32;
			    yspeed = 0;
			}*/
	    }
	}
	
	this.draw = function(){
        //Make Spyro draw himself
	    drawSprite(ctx, this.sprite, this.frame, this.x, this.y, -this.facing, 1, this.rotation);
    }
}
