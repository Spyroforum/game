function bringToZero( value, step )
{
    if( value > 0 )
    {
        value -= step;
        if( value < 0 ) value = 0;
    }
    else if( value < 0 )
    {
        value += step;
        if( value > 0 ) value = 0;
    }

    return value;
}

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

	this.step = function(){
	
		//Keyboard input and controls
		
		//Horizontal movement
		//(Don't let him accelerate past his max xspeed by walking, but still allow for higher speeds given from the environment)
		if( keyboard.isHeld(leftKey) ){
			if( this.xspeed > -this.maxXSpeed ){
				if( this.xspeed - 3 <= -this.maxXspeed)
					this.xspeed = -this.maxXSpeed;
				else 
					this.xspeed -= 3;
			}
			this.facing = -1;
		}
		if( keyboard.isHeld(rightKey) ){
			if( this.xspeed < this.maxXSpeed ){
				if( this.xspeed + 3 >= this.maxXspeed)
					this.xspeed = this.maxXSpeed;
				else 
					this.xspeed += 3;
			}
			this.facing = 1;
		}
		
		//Vertical movement
		this.yspeed += gravity;
		
		if( keyboard.isPressed(upKey) ){
			this.yspeed -= 17;
			audio.playSound(sndJump, 1, false);
		}
		
		//Stop in mid-air when holding space
		if( keyboard.isHeld(spaceKey) ){
			this.xspeed = 0;
			this.yspeed = 0;
		}
		
		//Movement and collision with terrain
	
		var speed;
		speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
		if( objLevel != null )
		if( speed > 0){
			//Starting position
			var xprev = this.x;
			var yprev = this.y;
			
			//Direction of movement
			var dx = this.xspeed / speed;
			var dy = this.yspeed / speed;
			
			var polygons = objLevel.polygons;
			var numPolys = polygons.length;//Number of polygons in the level, all of which are tested against
			
			
			var overlappingPolygons = [];
			overlappingPolygons.length = objLevel.polygons.length;
			//First loop through all jumpThrough polygons and mark those that Spyro overlapps. These will be skipped in further collision testing this step.
			var radius2 = this.radius * this.radius * 0.9;//Squared radius to test against squared distance, to determine overlapping,
			//reduced a little bit to be forgiving in situations where Spyro hasn't been completely moved out of tight cracks.
			for(var m = 0; m < numPolys; m++){
				overlappingPolygons[m] = false;
				if( polygons[m].jumpThrough ){
					//Position of the polygon
					var px = polygons[m].position.x;
					var py = polygons[m].position.y;
					//And it's list of points
					var p = polygons[m].points;
					var l = p.length;
					
					for(var n = 0; n < l; n++){
						if( p[n].solid ){//Only test against the line if it is solid
							var n2 = (n + 1) % l;
							var np = nearestPointOnLine(this.x, this.y, p[n].x + px, p[n].y + py, p[n2].x + px, p[n2].y + py);
							var xx = np.x - this.x;
							var yy = np.y - this.y;
							
							if( xx * xx + yy * yy <= radius2){
								overlappingPolygons[m] = true;
								break;
							}
						}
					}
				}
			}
			
			var distToMove = speed;
			var stepDist = this.radius * 0.7;
			var sqrRadius = this.radius * this.radius;
			
			while(distToMove > 0){
				//Make sure Spyro doesn't move further than he should
				if( stepDist > distToMove )
					stepDist = distToMove;
				//Move him one step and subtract the stepdistance form the distance yet to go
				this.x += stepDist * dx;
				this.y += stepDist * dy;
				distToMove -= stepDist;
				
				//An offset value used to skip jumpthrough lines if Spyro's feet(roughly) are below them, rather than Spyro's origin.
				var offset;
				if( this.yspeed < 0 )
					offset = this.radius * 0.65;
				else offset = this.radius * 0.65 / Math.max(1, this.yspeed / 4);
				
				//Then, in general, do this a number of times:
				//1. Check if Spyro is colliding with any lines.
				//2. Move out of the nearest line
				//Repeat the above two
				var g = 7;
				while (g--){
					var xDiff, yDiff, sqrDist;
					sqrDist = sqrRadius;
					
					//Find the required relationship information between Spyro and the nearest line
					for(var m = 0; m < numPolys; m++){
						if( ! overlappingPolygons[m] ){
							var px = polygons[m].position.x;
							var py = polygons[m].position.y;
							var p = polygons[m].points;
							var l = p.length;
							
							for(var n = 0; n < l; n++){
								if( p[n].solid ){//Only test against the line if it is solid
									var n2 = (n + 1) % l;
									var np = nearestPointOnLine(this.x, this.y, p[n].x + px, p[n].y + py, p[n2].x + px, p[n2].y + py);
									var xx = np.x - this.x;
									var yy = np.y - this.y;
									//If the polygon is jumpthrough and Spyro is not above the line, skip it.
									if( ! (yy - offset < 0 && polygons[m].jumpThrough) ){
										//Otherwise...
										var d = xx * xx + yy * yy;
										//Check if the line is touching Spyro, and if it is the nearest this far in the list
										if( d < sqrRadius && d < sqrDist){
											//Difference between the nearest point on the line and Spyro's position
											xDiff = xx;
											yDiff = yy;
											//The squared distance between Spyro's origin and the nearest point on the line
											sqrDist = d;
										}
									}
								}
							}
						}
					}
					//Push Spyro out of the nearest line
					if(sqrDist < sqrRadius){
						var pushFactor = (this.radius - Math.sqrt(sqrDist)) / this.radius;
						this.x -= xDiff * pushFactor;
						this.y -= yDiff * pushFactor;
					}
				}
				
			}
			//Calculate a new directional speed based on the movement this step.
			this.xspeed = this.x - xprev;
			this.yspeed = this.y - yprev;
			
		}
		this.frame += this.animSpeed;
	}
	
	this.draw = function(){
        //Make Spyro draw himself
        drawSprite(context, this.sprite, this.frame, this.x, this.y, -this.facing, 1, this.rotation);
		context.beginPath();
		context.arc(this.x,this.y,32,0,2*Math.PI);
		context.stroke();
    }
}
