
var SPYRO_FLAME_WIDTH = 128;
var SPYRO_FLAME_HEIGHT = 64;
var SPYRO_FLAME_SPEED = 8;
var SPYRO_JUMP_SPEED = 19;
var SPYRO_GLIDE_YSPEED = 6; // Constant falling speed
var SPYRO_HOVER_YSPEED = 14;
var SPYRO_RUN_XSPEED = 14; // Max run xspeed
var SPYRO_GLIDE_XSPEED = 18; // Max glide xspeed
var SPYRO_HOVER_XSPEED = 5; // Max hover xspeed
var SPYRO_FALL_XSPEED = 5; // Max fall xspeed
var SPYRO_CHARGE_XSPEED = 22; // Max charge xspeed
var SPYRO_SLOPE_ANGLE_LIMIT = 45; // Only lines with a slope angle smaller than 45 degrees will count as a floor to stand on
var SPYRO_MAX_HEALTH = 4;

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
	this.health = SPYRO_MAX_HEALTH;
	
	this.hovering = false;
	this.jumping = false;
	this.gliding = false;
	this.falling = false;
	this.charging = false;
	this.crashing = false;
	this.stepsSinceChargeInAir = 100;
	this.stateSteps = 0; // Used for counting how long Spyro has been jumping, hovering, falling etc.
	
	this.jump = function(){
		// note: "-= speed" and "= -speed" makes a big difference for jumping
		//	   the first option makes spyro jump higher when he runs up steep cliff
		this.yspeed = -SPYRO_JUMP_SPEED ;
		audio.playSound(sndJump, 1, false);
		if( this.charging ){
			this.frame = 0;
			this.animSpeed = 0;
		} else 
			this.sprite = sprSpyroJump;
		this.stateSteps = 0;
		this.frame = 0;
		this.onGround = false;
		this.jumping = true;
	}
	
	this.glide = function(){
		this.jumping = false;
		this.falling = false;
		this.gliding = true;
		this.charging = false;
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
		this.charging = false;
		this.crashing = false;
		this.stateSteps = 1;
		this.sprite = sprSpyroFall;
		this.frame = 0;
	}
	
	this.land = function(){
		this.falling = false;
		this.jumping = false;
		this.hovering = false;
		this.gliding = false;
		this.crashing = false;
		this.frame = 0;
		if( this.charging ){
			this.animSpeed = 0.5;
		} else {
			this.animSpeed = 0.25;
			if( Math.abs(this.xspeed) > 3)
				this.sprite = sprSpyroBreak;
			else
				this.sprite = sprSpyroIdle;
		}
	}
	
	this.charge = function(){
		this.falling = false;
		if( this.onGround )
			this.jumping = false;
		else this.jumping = true;
		this.hovering = false;
		this.gliding = false;
		this.charging = true;
		this.yspeed = Math.min(this.yspeed, 5);
		this.frame = 0;
		this.sprite = sprSpyroCharge;
		this.animSpeed = 0.5;
		this.stateSteps = 0;
	}
	
	this.crash = function(){
		this.falling = false;
		this.jumping = false;
		this.hovering = false;
		this.gliding = false;
		this.charging = false;
		this.crashing = true;
		this.frame = 0;
		this.yspeed = 0;
		this.xspeed = -10 * this.facing;
		this.animSpeed = 0.5;
		this.sprite = sprSpyroCrash;
		this.stateSteps = 0;
	}
	
	this.whileJumping = function(){
		if( this.charging ){
			this.frame = 0;
			this.animSpeed = 0;
			this.rotation = objectDirection( {x:0, y:0}, {x:Math.max(Math.abs(this.xspeed),10), y:this.yspeed*this.facing} );
		} else {
			if( this.stateSteps == 30 )
				this.fall();
				
			if( Math.round(this.frame) >= sprSpyroJump.frames - 1 ) // Loop the last few frames
				this.frame -= 2;
		}				
		if( this.onGround )
			this.land();
	}
	
	this.whileGliding = function(){
		// Make Spyro fall if he's gliding into something.
		var nl = levelPartCircle(this.x, this.y, this.radius * 2 + Math.abs(this.xspeed)); 
		levelPartRemoveCircle(nl, this.x, this.y, this.radius * 0.99);
		
		if( circleXlevelPart(this.x + this.facing * (2 + this.radius * 0.2), this.y, this.radius * 0.8, nl) ){
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
	
	this.whileCrashing = function(){
		if( this.frame >= sprSpyroCrash.frames - 1 ){
			this.animSpeed = 0.5;
			if( this.onGround ){
				this.land();
			} else {
				this.fall();
			}
		}
	}
	
	this.whileCharging = function(){
		var nl = levelPartCircle(this.x, this.y, this.radius * 2 + Math.abs(this.xspeed)); 
		levelPartRemoveCircle(nl, this.x, this.y, this.radius * 0.99);
		
		if( circleXlevelPart(this.x + this.facing * (2 + this.radius * 0.2), this.y, this.radius * 0.8, nl) ){
			this.xspeed = 0;
			this.crash();
		}
	}
	
	this.whileOnGround = function(){
        var hasFocus = !objLevel.isDialogActive();
		if( !this.crashing ){
			if( hasFocus && (controls.isDown(MOVE_LEFT_BUTTON) || controls.isDown(MOVE_RIGHT_BUTTON) || (this.charging && controls.isDown(CHARGE_BUTTON)))){
				if( this.charging )
					this.sprite = sprSpyroCharge;
				else
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
	}

	this.step = function(){
		//Keyboard input and controls
        var hasFocus = !objLevel.isDialogActive();
		
		//Horizontal movement
		//(Don't let him accelerate past his max xspeed by walking, but still allow for higher speeds given from the environment)
		if( this.falling ) this.maxXSpeed = SPYRO_FALL_XSPEED;
		else if( this.hovering ) this.maxXSpeed = SPYRO_HOVER_XSPEED;
		else if( this.gliding ) this.maxXSpeed = SPYRO_GLIDE_XSPEED;
		else if( this.charging ) this.maxXSpeed = SPYRO_CHARGE_XSPEED;
		else this.maxXSpeed = SPYRO_RUN_XSPEED;
		
		if( ! this.crashing ){
			if(controls.isDown(MOVE_LEFT_BUTTON) && hasFocus){
				
				if( this.charging ){
					this.xspeed = speedUpMinus(this.xspeed, this.acceleration * 3.2, -this.maxXSpeed);
					if( this.xspeed < 0 )
						this.facing = -1;
				} else {
					this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);
					this.facing = -1;
				}
			}
			if(controls.isDown(MOVE_RIGHT_BUTTON) && hasFocus){
				if( this.charging ){
					this.xspeed = speedUpPlus(this.xspeed, this.acceleration * 3.2, this.maxXSpeed);
					if( this.xspeed > 0 )
						this.facing = 1;
				} else {
					this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
					this.facing = 1;
				}
			}
		}
		
		//Automatic acceleration while gliding
		if( this.gliding ){
			this.xspeed += Math.max(-4, Math.min(this.facing * this.maxXSpeed - this.xspeed, 4));
		} else if( this.charging ){
			this.xspeed += Math.max(-8, Math.min(this.facing * this.maxXSpeed - this.xspeed, 8));
		}
		
		//Gravity and falling speed
		if( this.gliding )
			this.yspeed = SPYRO_GLIDE_YSPEED;
		else 
			if( ! this.onGround ) // this should probably be changed slightly if/when we add slippery terrain
				this.yspeed += gravity;
		
		//Stop in mid-air when holding space
		if(keyboard.isHeld(spaceKey) && hasFocus){
			this.xspeed = 0;
			this.yspeed = 0;
		}
		
			var prev_onGround = this.onGround; // These are used to stop spyro 
			var prev_yspeed = this.yspeed; // from sliding up steep slopes 
			var prev_xspeed = this.xspeed; // when he should be falling.
			
			//Collide with chests, and possibly other objects later
			//chestCollision(this);
			
			// Movement and collision with terrain
			var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
			// Extract a list of all lines within a (2 * radius + speed) distance from Spyro, because these are the only ones he could possibly collide with
			var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed); 
			
			//Make Spyro test if he's on the ground, and if he already was, but isn't any longer, make him fall.
			var wasOnGround = this.onGround;
			this.determineIfOnGround(nearLines); //Also makes Spyro align himself with the terrain
			if( wasOnGround && ! this.onGround )
				if( this.charging ){
					this.jumping = true;
				} else
					this.fall();
							
			if( this.onGround ){//Friction when not holding holding left/right keys
				if( ( (! controls.isDown(MOVE_LEFT_BUTTON) &&  ! controls.isDown(MOVE_RIGHT_BUTTON)) || this.crashing) || this.hasFocus){
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
			
			if( !prev_onGround ){
				this.yspeed = prev_yspeed;
				this.xspeed = prev_xspeed;
			}
			
		this.frame += this.animSpeed;
		
		//Jump related
		if((controls.isPressed(JUMP_BUTTON) || (this.charging && controls.isDown(JUMP_BUTTON))) && !this.crashing && hasFocus) {
			if( this.onGround ){
				this.jump();
			} else if( controls.isPressed(JUMP_BUTTON) ){
				if( this.jumping || (this.falling && (this.stateSteps > 10 || this.stepsSinceChargeInAir < 30)) )
					this.glide();
				else if( this.gliding )
					this.hover();
			}
		}
		
		// Charge if able to
		if( (controls.isDown(CHARGE_BUTTON) || (this.charging && ! this.onGround && this.stateSteps < 15)) && !this.crashing && hasFocus ){
			if( ! this.charging && !(this.stateSteps < 20 && ( this.falling || this.hovering || this.gliding )) && this.stepsSinceChargeInAir > 30 )
				this.charge();
		} else {
			if( this.charging){
				//this.xspeed /= 2;
				if( !this.onGround )
					this.fall();
			}
			this.charging = false;
			this.animSpeed = 0.25;
		}
		
		if( this.onGround )
			this.stepsSinceChargeInAir = 100;
		else if( this.charging )
			this.stepsSinceChargeInAir = 0;
		
		this.stateSteps++;
		this.stepsSinceChargeInAir++;
		
		if( this.gliding ) 
			this.whileGliding();
		if( this.hovering ) 
			this.whileHovering();
		if( this.jumping ) 
			this.whileJumping();
		if( this.falling ) 
			this.whileFalling();
		if( this.crashing ) 
			this.whileCrashing();
		if( this.charging )
			this.whileCharging();
			
		if( this.onGround && ! this.falling )
			this.whileOnGround();

        // update flame
        if( this.flame > 0 || ((controls.isPressed(FLAME_BUTTON) && !this.charging) && hasFocus) ){
            if( this.flame < SPYRO_FLAME_WIDTH ){
                this.flame += SPYRO_FLAME_SPEED;
            } else this.flame = 0;
        }
	}


	this.flameX = function(){
		var cos = Math.cos(-this.rotation / 180 * Math.PI);
		
		var offsetx = this.facing * ( this.radius + this.flame );
		
		return this.x + offsetx * cos;
	}


	this.flameY0 = function(){
		var cos = Math.cos(-this.rotation / 180 * Math.PI);
		var sin = Math.sin(-this.rotation / 180 * Math.PI);
		
		var offsetx = this.facing * ( this.radius + this.flame );
		var offsety = -SPYRO_FLAME_HEIGHT / 2;
		
		return this.y + offsety * cos + offsetx * sin;
	}


	this.flameY1 = function(){
		var cos = Math.cos(-this.rotation / 180 * Math.PI);
		var sin = Math.sin(-this.rotation / 180 * Math.PI);
		
		var offsetx = this.facing * ( this.radius + this.flame );
		var offsety = SPYRO_FLAME_HEIGHT / 2;
		
		return this.y + offsety * cos + offsetx * sin;
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
					// Align with the nearest solid point if this is within the slope angle limit
					var targetRotation =  objectDirection( p, this ) - 90;
					if( Math.abs(targetRotation) < SPYRO_SLOPE_ANGLE_LIMIT ){
						this.rotation = rotateDirectionTowards(this.rotation, targetRotation, 20);
				}
			}
		}
	}


	/**
		Parameters:
			type - id of harm type (ie fire, electricity, smash, etc) - will be added soon
	*/
	this.hurt = function(type){
		// TODO - change spyro state
		this.health--;
		if(this.health < 0)
			this.health = 0;
	}

	this.heal = function(){
		this.health++;
		if(this.health > SPYRO_MAX_HEALTH)
			this.health = SPYRO_MAX_HEALTH;
	}

	this.liveUp = function(){
		saveData.lives += 1;
		this.health = SPYRO_MAX_HEALTH;
        objCamera.infoPanelLives.show();
	}

	this.draw = function(){
		//Make Spyro draw himself
		drawSprite(context, this.sprite, this.frame, this.x, this.y, this.facing, 1, this.rotation);
		/*context.beginPath();
		context.arc(this.x,this.y,32,0,2*Math.PI);
		context.stroke();*/

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
