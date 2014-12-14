
/**
    Object requirements:
        x, y
*/
function objectDistance( obj1, obj2 ){
    var dx = obj1.x - obj2.x;
    var dy = obj1.y - obj2.y;
    return Math.sqrt( dx*dx + dy*dy );
}

/**
	Returns the direction from obj1 to obje2 in degrees. (right = 0 degrees, up = 90 degrees and so on).
    Object requirements:
        x, y
*/
function objectDirection( obj1, obj2 ){
	return (Math.atan2(obj1.y - obj2.y, -obj1.x + obj2.x)/ Math.PI * 180 + 360) % 360;
}

/**
    Object requirements:
        x, y, radius
*/
function objectCollide( obj1, obj2 ){
    return ( objectDistance( obj1, obj2 ) < ( obj1.radius + obj2.radius ) );
}


/**
    Object requirements:
        x, y, radius
*/
function objectCollideDistance( obj1, obj2, dist ){
    return ( objectDistance( obj1, obj2 ) < ( obj1.radius + obj2.radius + dist ) );
}


function slowDown( speed, acceleration ){
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

function slowDownXY( xspeed, yspeed, decceleration ){
	var spd = Math.sqrt(xspeed * xspeed + (yspeed) * (yspeed));
	if( spd > 0 ){
		var deccSpd = spd - decceleration;
		if( deccSpd > 0 ){
			xspeed *= deccSpd / spd;
			yspeed *= deccSpd / spd;
		} else {
			xspeed = 0;
			yspeed = 0;
		}
	}
	return {xspeed:xspeed, yspeed:yspeed};
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

/**
    Returns the difference between the angles a1 and a2, from -180 to 180 degrees
*/
function angleDifference(a1, a2){
	return ((((a2 - a1) % 360) + 540) % 360) - 180;
}


/**
    Rotates the direction 'dir1' towards 'dir2', but not more than 'amount' degrees
*/
function rotateDirectionTowards(dir1, dir2, amount){
	var angleDiff = angleDifference(dir1, dir2);//((((dir2 - dir1) % 360) + 540) % 360) - 180;
    return (dir1 + Math.min(amount, Math.max(-amount, angleDiff)) + 360) % 360;
}


/*
	Extract a list of array indexes of solid polygon lines touching the circle <x, y, radius> from the level's collision grid
	
	The returned list/array will contain objects with a 'polygonInd' property and a 'pointInd' property. 
	'polygonInd' is the index of the polygon that contains the line, while 'pointInd' is the index of the line's first endpoint, in the polygon's list of points.
	
	You find the polygon object containing the n-th line in the list like this:
	
	var lineIndList = levelPartCircle(x, y, radius)
	var o = lineIndList[n];
	var poly = objLevel.polygons[o.polygonInd];
	
	and then the two line endpoints like this:
	
	var p1 = poly.points[o.pointInd];
	var p2 = poly.points[(o.pointInd + 1) % poly.points.length];
*/
function levelPartCircle(x, y, radius){
	var g = objLevel.collisionGrid;
	//Find the range of cells in the collision grid to test for lines in
	var ax = Math.max(0, Math.floor((x - radius - g.x) / g.cellSize));
	var ay = Math.max(0, Math.floor((y - radius - g.y) / g.cellSize));
	var bx = Math.min(g.cellsX, Math.ceil((x + radius - g.x) / g.cellSize));
	var by = Math.min(g.cellsY, Math.ceil((y + radius - g.y) / g.cellSize));
	//The list we're adding lines to, if they touch the circle
	var list = [];
	//Loop through these cells
	for(var xx = ax; xx < bx; xx++){
		for(var yy = ay; yy < by; yy++){
			//Loop through the list of line indexes
			var cellList = g.cell[xx][yy];
			var l = cellList.length;
			for(var n = 0; n < l; n++){
				var ll = list.length;
				//If the line already is in the list, skip it this time
				var duplicate = false;//Make sure the line isn't already added to the list
				for(var m = 0; m < ll; m++){
					if( list[m] == cellList[n] ){
						duplicate = true;
						break;
					}
				}
				//If it isn't already in the list, check if it touches the circle, and add it to the list if it does.
				if( ! duplicate ){
					var poly = objLevel.polygons[cellList[n].polygonInd];
					var p1 = poly.points[cellList[n].pointInd];
					var p2 = poly.points[(cellList[n].pointInd + 1) % poly.points.length];
					if( circleXline(x - poly.position.x, y - poly.position.y, radius, p1.x, p1.y, p2.x, p2.y) )
						list.push(cellList[n]);
				}
			}
		}
	}
	return list;
}

/*
	Test if a circle is touching the lines contained in levelPart
*/
function circleXlevelPart(x, y, radius, levelPart){
	var l = levelPart.length;
	for(var n = 0; n < l; n++){
		var poly = objLevel.polygons[levelPart[n].polygonInd];
		var p1 = poly.points[levelPart[n].pointInd];
		var p2 = poly.points[(levelPart[n].pointInd + 1) % poly.points.length];
		if( circleXline(x - poly.position.x, y - poly.position.y, radius, p1.x, p1.y, p2.x, p2.y) ){
			return true;
		}
	}
	return false;
}

/*
	Remove those lines in levelPart that touches the circle <x, y, radius>
*/
function levelPartRemoveCircle(levelPart, x, y, radius){
	var l = levelPart.length;
	for(var n = 0; n < l; n++){
		var poly = objLevel.polygons[levelPart[n].polygonInd];
		var p1 = poly.points[levelPart[n].pointInd];
		var p2 = poly.points[(levelPart[n].pointInd + 1) % poly.points.length];
		if( circleXline(x - poly.position.x, y - poly.position.y, radius, p1.x, p1.y, p2.x, p2.y) ){
			levelPart.splice(n, 1);
			n--;
			l--;
		}
	}
}

/*
	Get the nearest point of <levelPart>, as measured form <x, y>, (optionally) within the max distance <radius>.
	If there is no point or the nearest point is outside the max distance
*/
function levelPartNearestPoint(levelPart, x, y, radius){
	var point = null;
	var sqrDist;
	if( radius != null )
		sqrDist = radius * radius;
	else sqrDist = 99999999999999999;// really big number because within the game, this is as good as infinite

	var l = levelPart.length;
	for(var n = 0; n < l; n++){
		var poly = objLevel.polygons[levelPart[n].polygonInd];
		var p1 = poly.points[levelPart[n].pointInd];
		var p2 = poly.points[(levelPart[n].pointInd + 1) % poly.points.length];
		var p = nearestPointOnLine(x, y, 
									p1.x + poly.position.x, p1.y + poly.position.y, 
									p2.x + poly.position.x, p2.y + poly.position.y);
		var sqrD = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y);
		if( sqrD < sqrDist ){
			sqrDist = sqrD;
			point = p;
		}
	}
	return point;
}

/*
    Requires object to have following properties:
        x, y, xspeed, yspeed, radius
*/
function objectXlevelPartCollision( object, levelPart )
{
    if( levelPart == null ) return false;

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
		
		//First loop through all jumpThrough polygons and mark those that the object overlap with.
		//These will be skipped in further collision testing this step.
		var overlappingPolygons = [];
		overlappingPolygons.length = objLevel.polygons.length;
		for(var m = 0; m < numPolys; m++){
			overlappingPolygons[m] = false;
		}
		
				
		//Squared radius to test against squared distance, to determine overlapping, reduced a little bit
		//to be forgiving in situations where object hasn't been completely moved out of tight cracks.
		var sqrRadius = object.radius * object.radius;
		var sqrRadiusSmaller = sqrRadius * 0.9;
		
		//And it's list of points
		var l = levelPart.length;
		
		for(var n = 0; n < l; n++){
			
			var polygonInd = levelPart[n].polygonInd;
				
			var poly = polygons[polygonInd];
			if( poly.jumpThrough ){
				var pointInd = levelPart[n].pointInd;
				var px = poly.position.x;
				var py = poly.position.y;
				var p1 = poly.points[pointInd];
				var p2 = poly.points[(pointInd + 1) % poly.points.length];
				var n2 = (n + 1) % l;
				var np = nearestPointOnLine(object.x, object.y, p1.x + px, p1.y + py, p2.x + px, p2.y + py);
				var xx = np.x - object.x;
				var yy = np.y - object.y;
				
				if( xx * xx + yy * yy <= sqrRadiusSmaller){
					overlappingPolygons[polygonInd] = true;
					break;
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
				for(var n = 0; n < l; n++){
				
					var polygonInd = levelPart[n].polygonInd;
					
					if( ! overlappingPolygons[polygonInd] ){
						var pointInd = levelPart[n].pointInd;
						
						var poly = polygons[polygonInd];
						var px = poly.position.x;
						var py = poly.position.y;
						
						var p1 = poly.points[pointInd];
						var p2 = poly.points[(pointInd + 1) % poly.points.length];
						
						var np = nearestPointOnLine(object.x, object.y, p1.x + px, p1.y + py, p2.x + px, p2.y + py);
						var xx = np.x - object.x;
						var yy = np.y - object.y;
						//If the polygon is jumpthrough and object is not above the line, skip it.
						if( ! (yy - offset < 0 && poly.jumpThrough) ){
							//Otherwise...
							var d = xx * xx + yy * yy;
							//Check if the line is touching object, and if it is the nearest this far in the list
							if( d < sqrRadius && d < sqrDist){
								//Difference between the nearest point on the line and object's position
								xDiff = xx;
								yDiff = yy;
								//The squared distance between object's origin and the nearest point on the line
								sqrDist = d;
							}
						}
					}
				}
				//Push object out of the nearest line
				if(sqrDist < sqrRadius){
					isCollision = true;
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
					isCollision = true;
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


/*
    Chcks if given object collides with spyro's flame.

    Object requirements:
        x, y, radius
*/
function isFlamed(object){
    // exit if no spyro or flame
    if(objSpyro == null) return false;
    if(objSpyro.flame < 1) return false;
    if(circleXline(object.x, object.y, object.radius, objSpyro.flameX(), objSpyro.flameY0(), objSpyro.flameX(), objSpyro.flameY1())){
        return true;
    } else {
        return false;
    }
}


/*
    Chcks if given object collides with spyro while he's charging.

    Object requirements:
        x, y, radius
*/
function isCharged(object){
    // exit if no spyro or flame
    /*if(objSpyro == null) return false;
    if(objSpyro.???) return false; // TODO
    if(collision ???){ // TODO
        return true;
    } else {
        return false;
    }*/
    return false; // DELETE ME
}

/*
    Check for and react to collision with all chest objects

    Object requirements:
        x, y, radius, xspeed, yspeed
*/
function chestCollision(object){

	if( objLevel == null ) return false;
	
	var otype = [];
	otype[0] = objLevel.ChestBasket;
	otype[1] = objLevel.ChestVase;
	otype[2] = objLevel.ChestLife;
	var n, i, chest;
	// loop through all chest objects
	for(n = 0; n < otype.length; n++){
		for(i = 0; i < otype[n].length; i++){
			chest = otype[n][i];
			var xx, yy, d, r, m;
			xx = object.x + object.xspeed - chest.x;
			yy = object.y + object.yspeed - chest.y;
			d = Math.sqrt(xx*xx+yy*yy);
			r = chest.radius + object.radius;
			// test if there is a collision between the object and the current chest
			if( d < r ){
				// react to that collision
				if( ! object.onGround ){
					// move the object's target destination (x+xspeed, y+yspeed) out of the chest
					m = (r - d) / r;
					object.xspeed += xx * m;
					object.yspeed += yy * m;
				} else {
					// do the same, but change xspeed only
					var r = Math.sqrt(r * r - yy * yy);
					d = Math.abs(xx)
					m = (r - d) / r;
					object.xspeed += xx * m;
				}
			}
		}
	}
}