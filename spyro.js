
var SPYRO_FLAME_WIDTH = 128;
var SPYRO_FLAME_HEIGHT = 64;
var SPYRO_FLAME_SPEED = 8;

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
	this.onGround = false;
    this.flame = 0;
	
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
        //if( ! this.onGround ) // this should probably be changed slightly if/when we add slippery terrain
			this.yspeed += gravity;
		
		//Stop in mid-air when holding space
		if( keyboard.isHeld(spaceKey) ){
			this.xspeed = 0;
			this.yspeed = 0;
		}
		
		// Movement and collision with terrain
		
			// Calculate Spyro's current speed
			var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
			// Extract a list of all lines within a (2 * radius + speed) distance from Spyro, because these are the only ones he could possibly collide with
			var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed); 
			
			// Check if Spyro is on the ground
				//We need to test if there are any lines directly below Spyro to tell if he is on the ground
				
				// (1)First make a copy of nearLines
				var nearLinesNotOverlapping = nearLines.slice();// .slice() without anything in the parentheses simply creates a copy of the array
				// This copy still contains eventual lines that Spyro might overlap with, such as jump-through ones, so
				// we need to remove those, so that we can test against only those roughly in his periphery.
				// (2) remove from the copy, all lines within a distance of radius * 0.99 from Spyro's current position.
				// Multiplying the radius with 0.99 is just to be sure we don't remove lines that Spyro might actually be standing on.
				levelPartRemoveCircle(nearLinesNotOverlapping, this.x, this.y, this.radius * 0.99);
				// (3) Now the copy only contains the lines outside of Spyro. To see if he's standing on any of them, we do 
				// a circle intersection test with these remaining lines. 
				// The circle we use is a very slightly shrunk and lowered version of Spyro's circle.
				// If we ignore the '+ 1' for the y displacement of the circle, the circle is sizeFactor times as big as Spyro's circle,
				// with it's bottom point placed exactly at Spyro's circle's bottom point.
				var sizeFactor = 0.95;
				this.onGround = circleXlevelPart(this.x, this.y + this.radius * (1 - sizeFactor) + 1, this.radius * sizeFactor, nearLinesNotOverlapping);
				// If there is a line directly below Spyro, circleXlevelPart() will return 'true'.
							
			if( this.onGround ){//Friction when not holding holding left/right keys
				if( ! keyboard.isHeld(leftKey) && ! keyboard.isHeld(rightKey) ){
					var ret = slowDownXY( this.xspeed, this.yspeed, 1.5 );
					this.xspeed = ret.xspeed;
					this.yspeed = ret.yspeed;
				}
			}
			
			// 'objectXlevelPartCollision()' makes Spyro move, collide and slide naturally against the 
			// lines in 'nearLines' while taking the jump-through-ability of lines in consideration
			
			var isCollision = objectXlevelPartCollision( this, nearLines );
			
			if( this.onGround )
			{	
				//this.xspeed = slowDown( this.xspeed, 1.5 );
				if( keyboard.isPressed(upKey) ) this.jump();
			}

		// search for gems to pick
        for( var i = 0; i < objLevel.Gem.length; i++ ){
            if( objectCollide( this, objLevel.Gem[i] ) ){
                // fix if spyro collected the gem faster than sparx
                if( objSparx.gem == objLevel.Gem[i] )
                    objSparx.gem = null;

                objLevel.Gem[i].alive = false;
                // TODO: increase gem count
            }
        }

        this.updateFlame();
		
		this.frame += this.animSpeed;
	}


    this.updateFlame = function(){
        if( this.flame > 0 || keyboard.isPressed(aKey) ){
            if( this.flame < SPYRO_FLAME_WIDTH ){
                this.flame += SPYRO_FLAME_SPEED;
                // search for enemies to kill
                for( var i = 0; i < objLevel.Enemy.length; i++ ){
                    // there is horizontal line for collision
                    var enemy = objLevel.Enemy[i];
                    if( circleXline( enemy.x, enemy.y, enemy.r, this.flameX(), this.flameY0(), this.flameX(), this.flameY1() ) ){
                        enemy.kill();
                    }
                }
            } else this.flame = 0;
        }
    }


    this.flameX = function(){
        return this.x + this.facing * ( this.radius + this.flame );
    }


    this.flameY0 = function(){
        return this.y - SPYRO_FLAME_HEIGHT / 2;
    }


    this.flameY1 = function(){
        return this.y + SPYRO_FLAME_HEIGHT / 2;
    }
	

	this.draw = function(){
        //Make Spyro draw himself
        drawSprite(context, this.sprite, this.frame, this.x, this.y, -this.facing, 1, this.rotation);
		context.beginPath();
		context.arc(this.x,this.y,32,0,2*Math.PI);
		context.stroke();
		this.sprite = sprSpyro;

        // draw flame
        if( this.flame > 0 ){
            context.strokeStyle = "#FF4400";
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo( this.flameX(), this.flameY0() );
            context.lineTo( this.flameX(), this.flameY1() );
            context.stroke();
        }
    }
}
