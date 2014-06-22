function Spyro(){
    this.x = 100;
	this.y = 100;
	this.xspeed = 0;
	this.yspeed = 0;
	this.facing = -1;
	this.sprite = sprSpyro;
	this.frame = 0;
	this.animSpeed = 0.25;
	this.rotation = 0;
	this.terrain = null;//NEW(sheep)
	
	this.step = function(){
	    with (this){
		
		    //Movement and facing direction
		    if( keyboard.isHeld(leftKey) ){
			    x -= 10;
			    facing = -1;
		    }
		    if( keyboard.isHeld(rightKey) ){
			    x += 10;
			    facing = 1;
		    }
			
			//NEW(sheep) collide with terrain on x axis
			if( terrain != null ){
				if( terrain.collideRect(x - 32, y - 32, 64, 64) ){
					if( facing == -1 )
						x = Math.floor((x - 32) / terrain.blockSize + 1) * terrain.blockSize + 32;
					else
						x = Math.ceil((x + 32) / terrain.blockSize - 1) * terrain.blockSize - 32;
				}
			}
			
			//Jump
		    if( keyboard.isPressed(upKey) ){
			    yspeed -= 15;
				audio.playSound(sndJump, 1, false);
			}
		
		    //Change animation speed with the S key, just to show the keyboard.isReleased function
		    if( keyboard.isPressed(sKey) )
			    animSpeed = 0.0;
		    else if( keyboard.isReleased(sKey) )
			    animSpeed = 0.25;
		
		    //Rotate Spyro by pressing the A key
		    if( keyboard.isPressed(aKey) )
			    rotation += 45;
			
			//Gravity
			yspeed += gravity;
			y += yspeed;
			
			//collide with terrain on y axis
			if( terrain != null ){
				if( terrain.collideRect(x - 32, y - 32, 64, 64) ){
					//Align spyro with the grid on the y axis
					if( yspeed < 0 )
						y = Math.floor( ( y - 32 ) / terrain.blockSize + 1) * terrain.blockSize + 32;
					else
						y = Math.ceil( ( y + 32 ) / terrain.blockSize - 1) * terrain.blockSize - 32;
					yspeed = 0;
				}
			}
			
			//Animate
			frame += animSpeed;
	    }
	}
	
	this.draw = function(){
        //Make Spyro draw himself
		drawSprite(ctx, this.sprite, this.frame, this.x, this.y, -this.facing, 1, this.rotation);
    }
}
