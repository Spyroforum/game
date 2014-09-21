
var SPYRO_FLAME_WIDTH = 128;
var SPYRO_FLAME_HEIGHT = 64;
var SPYRO_FLAME_SPEED = 8;
var SPYRO_JUMP_SPEED = 19;
var SPYRO_GLIDE_YSPEED = 6; // Constant falling speed
var SPYRO_HOVER_YSPEED = 14;
var SPYRO_RUN_XSPEED = 15; // Max run xspeed
var SPYRO_GLIDE_XSPEED = 18; // Max glide xspeed
var SPYRO_HOVER_XSPEED = 5; // Max hover xspeed
var SPYRO_FALL_XSPEED = 5; // Max fall xspeed
var SPYRO_SLOPE_ANGLE_LIMIT = 45; // Only lines with a slope angle smaller than 45 degrees will count as a floor to stand on

function Spyro(){
    this.x = 100;
	this.y = 100;
	this.xspeed = 0;
	this.yspeed = 0;
    this.maxXSpeed = 15;
	this.facing = -1;
	this.sprite = sprSpyroIdle;
	this.frame = 0;
	this.animSpeed = 0.25;
	this.rotation = 0;
	this.radius = 32;
	this.acceleration = 3;
	this.onGround = false;
    this.flame = 0;
	
	this.hovering = false;
	this.jumping = false;
	this.gliding = false;
	this.falling = false;
	this.stateSteps = 0; // Used for counting how long Spyro has been jumping, hovering, falling etc.
	
	this.jump = function(){
        // note: "-= speed" and "= -speed" makes a big difference for jumping
        //       the first option makes spyro jump higher when he runs up steep cliff
        this.yspeed = -SPYRO_JUMP_SPEED ;
		audio.playSound(sndJump, 1, false);
		this.sprite = sprSpyroJump;
		this.frame = 0;
		this.onGround = false;
		this.stateSteps = 0;
		this.jumping = true;
	}
	
	this.glide = function(){
		this.jumping = false;
		this.falling = false;
		this.gliding = true;
        this.yspeed = SPYRO_GLIDE_YSPEED ;
		this.sprite = sprSpyroGlide;
		this.frame = 0;
	}
	
	this.hover = function(){
		this.gliding = false;
		this.hovering = true;
		this.stateSteps = 0;
		this.sprite = sprSpyroHover;
		this.frame = 0;
		this.yspeed = -SPYRO_HOVER_YSPEED;
		this.xspeed *= 0.5;
	}
	
	this.fall = function(){
		this.jumping = false;
		this.hovering = false;
		this.gliding = false;
		this.falling = true;
		this.stateSteps = 1;
		this.sprite = sprSpyroFall;
		this.frame = 0;
	}
	
	this.land = function(){
		this.falling = false;
		this.jumping = false;
		this.hovering = false;
		this.gliding = false;
		this.frame = 0;
		if( Math.abs(this.xspeed) > 3)
			this.sprite = sprSpyroBreak;
		else
			this.sprite = sprSpyroIdle;
	}
	
	this.whileJumping = function(){
		if( this.stateSteps == 30 )
			this.fall();
			
		if( Math.round(this.frame) >= sprSpyroJump.frames - 1 ) // Loop the last few frames
			this.frame -= 2;
			
		if( this.onGround )
			this.land();
	}
	
	this.whileGliding = function(){
		// Make Spyro fall if he's gliding into something.
		var nl = levelPartCircle(this.x, this.y, this.radius * 2 + Math.abs(this.xspeed)); 
		levelPartRemoveCircle(nl, this.x, this.y, this.radius * 0.99);
		
		if( circleXlevelPart(this.x + this.facing * (1 + this.radius * 0.2), this.y, this.radius * 0.8, nl) ){
			this.xspeed = 0;
			this.fall();
		}
			
		if( this.onGround )
			this.land();
	}
	
	this.whileHovering = function(){
		if( this.stateSteps > 6 ){
			if( Math.round(this.frame) == 0 || Math.round(this.frame) == 4 ){ // Loop frames
				this.frame += 2;
			}
			if( this.stateSteps == 30 ){
				this.fall();
			}
		}
		if( this.onGround )
			this.land();
	}
	
	this.whileFalling = function(){
		if( ! this.onGround ){ // Loop three of the frames while falling
			if( this.frame > 6 )
				this.frame -= 3;
		} else {
			if( this.frame < 7 ) // Skip to the part of the animation where Spyro hits the ground, when he does hit the ground.
				this.frame = 7;
			if( Math.round(this.frame) > 9 ){ // When the falling animation is over, go to the state of having landed
				this.land();
			}
		}
	}
	
	this.whileOnGround = function(){
		if( keyboard.isHeld(leftKey) || keyboard.isHeld(rightKey)){
			this.sprite = sprSpyroRun;
		} else {
			if( this.sprite != sprSpyroBreak && this.sprite != sprSpyroIdle ){
				if( Math.abs(this.xspeed) > 3){
					this.sprite = sprSpyroBreak;
					this.frame = 0;
				} else if( this.sprite != sprSpyroIdle ){
					this.sprite = sprSpyroIdle;
					this.frame = 0;
				}
			} else {
				if( Math.round(this.frame) == sprSpyroBreak.frames - 1 )
					this.sprite = sprSpyroIdle;
			}
		}
	}

	this.step = function(){
		//Keyboard input and controls
		
		//Horizontal movement
		//(Don't let him accelerate past his max xspeed by walking, but still allow for higher speeds given from the environment)
		if( this.falling ) this.maxXSpeed = SPYRO_FALL_XSPEED;
		else if( this.hovering ) this.maxXSpeed = SPYRO_HOVER_XSPEED;
		else if( this.gliding ) this.maxXSpeed = SPYRO_GLIDE_XSPEED;
		else this.maxXSpeed = SPYRO_RUN_XSPEED;
			
		if( keyboard.isHeld(leftKey) ){
			this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);
			this.facing = -1;
		}
		if( keyboard.isHeld(rightKey) ){
			this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
			this.facing = 1;
		}
		
		//Automatic acceleration while gliding
		if( this.gliding ){
			this.xspeed += Math.max(-4, Math.min(this.facing * this.maxXSpeed - this.xspeed, 4));
		}
		
		//Gravity and falling speed
		if( this.gliding )
			this.yspeed = SPYRO_GLIDE_YSPEED;
		else 
			if( ! this.onGround ) // this should probably be changed slightly if/when we add slippery terrain
				this.yspeed += gravity;
		
		//Stop in mid-air when holding space
		if( keyboard.isHeld(spaceKey) ){
			this.xspeed = 0;
			this.yspeed = 0;
		}
		
		// Movement and collision with terrain
			var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
			// Extract a list of all lines within a (2 * radius + speed) distance from Spyro, because these are the only ones he could possibly collide with
			var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed); 
			
			//Make Spyro test if he's on the ground, and if he already was, but isn't any longer, make him fall.
			var wasOnGround = this.onGround;
			this.determineIfOnGround(nearLines); //Also makes Spyro align himself with the terrain
			if( wasOnGround && ! this.onGround )
				this.fall();
							
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
			
			// (if onGround) Make Spyro not move off the ground by running
			this.stickToGround();
			
			this.frame += this.animSpeed;
			
			//Jump related
			if( keyboard.isPressed(upKey) ) {
				if( this.onGround ){
					this.jump();
				} else {
					if( this.jumping || (this.falling && this.stateSteps > 10) )
						this.glide();
					else if( this.gliding )
						this.hover();
				}
			}
			
			this.stateSteps++;
			
			if( this.gliding ) 
				this.whileGliding();
			if( this.hovering ) 
				this.whileHovering();
			if( this.jumping ) 
				this.whileJumping();
			if( this.falling ) 
				this.whileFalling();
				
			if( this.onGround && ! this.falling )
				this.whileOnGround();

		// search for gems to pick
        for( var i = 0; i < objLevel.Gem.length; i++ ){
            if( objectCollide( this, objLevel.Gem[i] ) ){
                // fix if spyro collected the gem faster than sparx
                if( objSparx.gem == objLevel.Gem[i] )
                    objSparx.gem = null;

                objLevel.Gem[i].kill();
            }
        }

        this.updateFlame();
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
	
	this.determineIfOnGround = function(nearLines){
		var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
		
		// Get the near lines outside of Spyro
		var levelPart = nearLines.slice();
		levelPartRemoveCircle(levelPart, this.x, this.y, this.radius * 0.99);
			
		var wasOnGround = this.onGround;
		this.onGround = false;
		
		if( ! ( this.jumping && this.stateSteps < 2 ) ){ // Make sure Spyro isn't in the start of a jump

			var dist = this.radius * 2; // Used for finding out which line is "first" hit by a ray
			var targetRotation = 0;
			
			// Loop through all the near lines
			var l = levelPart.length;
			for(var n = 0; n < l; n++){
				var poly = objLevel.polygons[levelPart[n].polygonInd];
				var p1 = poly.points[levelPart[n].pointInd];
				var p2 = poly.points[(levelPart[n].pointInd + 1) % poly.points.length];
				
				//Calculate the slope angle(in degrees) of the line
				var ap, bp;
				if( p1.x < p2.x ){
					ap = p1;
					bp = p2;
				} else {
					ap = p2;
					bp = p1;
				}
				var lineSlope = objectDirection(ap, bp);
				// Check if this angle is smaller than or equal to the max slope angle
				if( Math.abs(angleDifference(lineSlope, 0)) <= SPYRO_SLOPE_ANGLE_LIMIT ){
					// Check that Spyro either already is on the ground, or that he isn't moving up along the line's normal.
					// This is to make him not immediately stick to jumpthrough lines when jumping up through them.
					if(  wasOnGround || (this.xspeed * (ap.y - bp.y) + this.yspeed * (bp.x - ap.x) >= 0) ){
						// Do a ray intersection test with the line and get the distance the ray goes before intersecting, if there is an intersection
						var d = rayXline(this.x, this.y, 
										0, 1, //down unit vector
										p1.x + poly.position.x, p1.y + poly.position.y, 
										p2.x + poly.position.x, p2.y + poly.position.y,
										false);
						if( d != null ){
							if( d < dist ){ // Check that the line is the thus far nearest line
								// Check if the ray distance is something that would be expected if Spyro is standing on the line,
								// with a larger error margin if Spyro already was on the ground
								var margin = 2;
								if( wasOnGround ) margin += 6;
								if( d < (this.radius + margin) / Math.cos(lineSlope * Math.PI / 180) ){
									// Spyro considers himself as being on the ground! :D
									this.onGround = true;
									// Set the target rotation(for Spyro) to the angle of the slope. 
									var targetRotation = lineSlope;
									dist = d;
								}
							}
						}
					}
				}
			}
			// Align with the ground part 1
			this.rotation = rotateDirectionTowards(this.rotation, targetRotation, 20);
		}
	}
	
	this.stickToGround = function(){
		// Stick to the ground if already on the ground, and align with the terrain
		if( this.onGround ){
			var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
			// Get the near lines outside of Spyro
			var nearLinesNotOverlapping = levelPartCircle(this.x, this.y, this.radius * 2 + speed); 
			levelPartRemoveCircle(nearLinesNotOverlapping, this.x, this.y, this.radius * 0.99);
			
			// Move Spyro down step by step until he has ground under his feet - To Do:(maybe) optimize, because it might be heavy if he has to be moved down a big distance
			for(var n = 0; n < speed + 8; n += 0.5){
				if( ! circleXlevelPart(this.x, this.y + 1, this.radius, nearLinesNotOverlapping) ){
					this.y += 0.5;
				} else break;
			}
			
			// Align with the ground part 2 - this allows for a slightly smoother rotation when walking over "sharp"(relatively) angles
			// Find the nearest solid point
			var p = levelPartNearestPoint(nearLinesNotOverlapping, this.x, this.y, this.radius * 1.2);
			if( p != null ){
					this.nearestPoint.x = p.x
					this.nearestPoint.y = p.y
					// Align with the nearest solid point if this is within the slope angle limit
					var targetRotation =  objectDirection( p, this ) - 90;
					if( Math.abs(targetRotation) < SPYRO_SLOPE_ANGLE_LIMIT ){
						this.rotation = rotateDirectionTowards(this.rotation, targetRotation, 20);
				}
			}
		}
	}

	this.draw = function(){
        //Make Spyro draw himself
        drawSprite(context, this.sprite, this.frame, this.x, this.y, this.facing, 1, this.rotation);
		context.beginPath();
		context.arc(this.x,this.y,32,0,2*Math.PI);
		context.stroke();

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
