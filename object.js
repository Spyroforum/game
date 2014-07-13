
function slowDown( speed, acceleration )
{
    if( speed > 0 )
    {
        speed -= acceleration;
        if( speed < 0 ) speed = 0;
    }
    else if( speed < 0 )
    {
        speed += acceleration;
        if( speed > 0 ) speed = 0;
    }

    return speed;
}


function speedUpPlus(speed, acceleration, maximum){
    if( speed < maximum ){
		if( speed + acceleration >= maximum)
			speed = maximum;
		else 
			speed += acceleration;
	}
	
	return speed;
}


function speedUpMinus(speed, acceleration, minimum){
    if( speed > minimum ){
		if( speed - acceleration <= minimum)
			speed = minimum;
		else 
			speed -= acceleration;
	}
	
	return speed;
}


/*
    Requires object to have following properties:
        x, y, xspeed, yspeed, radius
*/
function objectXlevelCollision( object )
{
    if( objLevel == null ) return false;

    var isCollision = false;
	var speed = Math.sqrt(object.xspeed * object.xspeed + object.yspeed * object.yspeed);
	if( speed > 0){
		//Starting position
		var xprev = object.x;
		var yprev = object.y;
		
		//Direction of movement
		var dx = object.xspeed / speed;
		var dy = object.yspeed / speed;
		
		var polygons = objLevel.polygons;
		var numPolys = polygons.length;//Number of polygons in the level, all of which are tested against
		
		//First loop through all jumpThrough polygons and mark those that object overlapps.
		//These will be skipped in further collision testing this step.
		var overlappingPolygons = [];
		overlappingPolygons.length = objLevel.polygons.length;
		
		//Squared radius to test against squared distance, to determine overlapping, reduced a little bit
		//to be forgiving in situations where object hasn't been completely moved out of tight cracks.
		var sqrRadius = object.radius * object.radius;
		var sqrRadiusSmaller = sqrRadius * 0.9;
		
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
					if( p[n].solid ){ //Only test against the line if it is solid
						var n2 = (n + 1) % l;
						var np = nearestPointOnLine(object.x, object.y, p[n].x + px, p[n].y + py, p[n2].x + px, p[n2].y + py);
						var xx = np.x - object.x;
						var yy = np.y - object.y;
						
						if( xx * xx + yy * yy <= sqrRadiusSmaller){
							overlappingPolygons[m] = true;
							break;
						}
					}
				}
			}
		}
		
		var distToMove = speed;
		var stepDist = object.radius * 0.7;
		
		while(distToMove > 0){
			//Make sure object doesn't move further than he should
			if( stepDist > distToMove )
				stepDist = distToMove;
			//Move it one step and subtract the stepdistance form the distance yet to go
			object.x += stepDist * dx;
			object.y += stepDist * dy;
			distToMove -= stepDist;
			
			//An offset value used to skip jumpthrough lines if object's feet(roughly) are below them, rather than object's origin.
			var offset;
			if( object.yspeed < 0 )
				offset = object.radius * 0.65;
			else offset = object.radius * 0.65 / Math.max(1, object.yspeed / 4);
			
			//Then, in general, do this a number of times:
			//1. Check if object is colliding with any lines.
			//2. Move out of the nearest line
			//Repeat the above two
			var g = 7;
			while (g--){
				var xDiff, yDiff, sqrDist;
				sqrDist = sqrRadius;
				
				//Find the required relationship information between object and the nearest line
				for(var m = 0; m < numPolys; m++){
					if( ! overlappingPolygons[m] ){
						var px = polygons[m].position.x;
						var py = polygons[m].position.y;
						var p = polygons[m].points;
						var l = p.length;
						
						for(var n = 0; n < l; n++){
							if( p[n].solid ){//Only test against the line if it is solid
								var n2 = (n + 1) % l;
								var np = nearestPointOnLine(object.x, object.y, p[n].x + px, p[n].y + py, p[n2].x + px, p[n2].y + py);
								var xx = np.x - object.x;
								var yy = np.y - object.y;
								//If the polygon is jumpthrough and object is not above the line, skip it.
								if( ! (yy - offset < 0 && polygons[m].jumpThrough) ){
									//Otherwise...
									var d = xx * xx + yy * yy;
									//Check if the line is touching object, and if it is the nearest this far in the list
									if( d < sqrRadius && d < sqrDist){
									isCollision = true;
										//Difference between the nearest point on the line and object's position
										xDiff = xx;
										yDiff = yy;
										//The squared distance between object's origin and the nearest point on the line
										sqrDist = d;
									}
								}
							}
						}
					}
				}
				//Push object out of the nearest line
				if(sqrDist < sqrRadius){
					var pushFactor = (object.radius - Math.sqrt(sqrDist)) / object.radius;
					object.x -= xDiff * pushFactor;
					object.y -= yDiff * pushFactor;
				}
			}
			
		}
		//Calculate a new directional speed based on the movement this step.
		object.xspeed = object.x - xprev;
		object.yspeed = object.y - yprev;
	}
	
	return isCollision;
}
