//Some collision related functions


/* nearest point on a line
	<px, py> - point to measure from
	<x1, y1> - first endpoint on line
	<x2, y2> - second endpoint on line
	
	returns - an object with an x and an y property being the nearest point on the line
*/
function nearestPointOnLine(px,py,x1,y1,x2,y2){

	var lx = x2 - x1;
    var ly = y2 - y1;
	
    if ( lx == 0 && ly == 0 ) {//If the vector is of length 0,
		//the two endpoints have the same position, so the nearest point is at that position
        return {
			x: x1,
			y: y1
		};
    } else {
		//Find the factor for how far along the line, from <x1,y1>, the nearest point is
        var g = ((px - x1) * lx + (py - y1) * ly) / (lx * lx + ly * ly);
		if( g < 0 ) g = 0;
		else if( g > 1 ) g = 1;
		//And calculate the nearest point
		return new Point(x1 + g * lx, y1 + g * ly);
    }
}
/*  circle x line
	<cx, cy> - circle center
	<dx, dy> - a unit vector, the direction of the ray
	<cx, cy, r> - circle center and radius
	type - What to test against, 0: both inside and outside of circle, 1: only outside of circle, 2: only inside of circle
	
	Returns: true if there is an intersection, false if not
*/
function circleXline(cx, cy, r, x1, y1, x2, y2){

	//The vector from the first endpoint to the second
    var lx = x2 - x1;
    var ly = y2 - y1;
	
	var nx, ny;//Nearest point on the line
	
    if ( lx == 0 && ly == 0 ) {//If the vector is of length 0,
		//the two endpoints have the same position, so the nearest point is at that position
        nx = x1;
        ny = y1;
    } else {
		//Find the factor for how far along the line, from <x1,y1>, the nearest point is
        var g = ((cx - x1) * lx + (cy - y1) * ly) / (lx * lx + ly * ly);
		if( g < 0 ) g = 0;
		else if( g > 1 ) g = 1;
		//And calculate the nearest point
		nx = x1 + g * lx;
		ny = y1 + g * ly;
    }
    var dist = (cx - nx) * (cx - nx) + (cy - ny) * (cy - ny);//Squared distance from circe center to line
	if( dist <= r * r)
		return true;
	else return false;
}

/*  ray x circle
	<rx, ry> - starting position of the ray
	<dx, dy> - a unit vector, the direction of the ray
	<cx, cy, r> - circle center and radius
	type - What to test against, 0: both inside and outside of circle, 1: only outside of circle, 2: only inside of circle
	
	Returns: the distance to where the ray first intersects with the circle, or 'null' if there is no intersection
*/
function rayXcircle(rx, ry, dx, dy, cx, cy, r, type){

	var xx = cx - rx; 
	var yy = cy - ry; 
	var b = ( xx * dx + yy * dy );
	var c = xx * xx + yy * yy - r * r;
	if ( b * b - c > 0 ){
	
		var q = Math.sqrt( b * b - c );
		
		if ( type != 2 )
			if ( b - q >= 0)//Outside of circle
				return b - q;
			
		if ( type != 1 )
			if ( b + q >= 0)//Inside of circle
				return b + q;
	}
	return null;
}

/*  ray x line
	<rx, ry> - starting position of the ray
	<dx, dy> - a unit vector, the direction of the ray
	<x1, y1> - first endpoint of the line
	<x2, y2> - second endpoint of the line
	infinite - boolean, whether the line should be infinitely long in both directions, or not
	
	Returns: the distance to where the ray intersects with the line, or 'null' if there is no intersection
*/
function rayXline(rx, ry, dx, dy, x1, y1, x2, y2, infinite){
	
	var lx, ly, d, nx, ny, a, b;
	lx = x2 - x1;
	ly = y2 - y1;
	d = Math.sqrt(lx * lx + ly * ly);
	nx = ly / d;
	ny = -lx / d;
	
	a = dx * nx + dy * ny;
	b = (x1 - rx) * nx + ( y1 - ry ) * ny;

	if( a != 0 && ( a > 0 ^ b < 0 ) ){//Check if there is an intersection with the inifinite line
	
		l = b / a;
		if( infinite )
			return l;
		else {
			var xx = rx + dx * l;
			var yy = ry + dy * l;
			var g = ((xx - x1) * lx + (yy - y1) * ly) / (lx * lx + ly * ly);
			if( g >=  0 && g <= 1)
				return l;
			else return null;
			
		}
	} else return null;
}

/*  swept circle x line (This function might not be working correctly)
	<cx, cy, r> - circle center starting point and radius
	<dx, dy> - a unit vector, the direction the circle is moving in
	<x1, y1> - first endpoint of the line
	<x2, y2> - second endpoint of the line
	
	Returns: the distance the circle can move before hitting the line, or null if it never hits
*/
function sweptCircleXline(cx,cy,r,dx,dy,x1,y1,x2,y2){
	
	if(x2 == x1 && y2 == y1){
		if( (cx - x1) * (cx - x1) + (cy - y1) * (cy - y1) < r * r){
			return 0;
		}else {
			return rayCircle(cx, cy, dx, dy, x1, y1, r, 1);
		}
	} else {

		var lx = x2 - x1;
		var ly = y2 - y1;
		
		var d = Math.sqrt(lx * lx + ly * ly);
		var nx = ly / d;
		var ny = -lx / d;
		
		if( Math.abs(nx * (cx - x1) + ny * (cy - y1)) > r ){
			
			var cxo, cyo;

			if( (x1 - cx) * nx + ( y1 - cy ) * ny < 0 ) {
				cxo = cx - nx * r;
				cyo = cy - ny * r;
			} else {
				cxo = cx + nx * r;
				cyo = cy + ny * r;
			}
			
			var a = dx * nx + dy * ny;
			var b = (x1 - cxo) * nx + ( y1 - cyo ) * ny;
			
			if( a != 0 && ( a > 0 ^ b < 0 ) ){
			
				var l = b / a;
				var xx = cxo + dx * l;
				var yy = cyo + dy * l;
				var g = ((xx - x1) * lx + (yy - y1) * ly) / (lx * lx + ly * ly);
				
				if( g < 0 ){
					return rayCircle(cx, cy, dx, dy, x1, y1, r, 1);
				}else if( g > 1 ){
					return rayCircle(cx, cy, dx, dy, x2, y2, r, 1);
				}else {
					return l;
				}
			} else {
				return null;
			}
			
		} else {
		
			if( lx * (cx - x1) + ly * (cy - y1) < 0 ){
			
				if( (cx - x1) * (cx - x1) + (cy - y1) * (cy - y1) < r * r){
					return 0;
				}else {
					return rayCircle(cx, cy, dx, dy, x1, y1, r, 1);
				}
					
			} else if( lx * (cx - x2) + ly * (cy - y2) > 0 ){
			
				if( (cx - x2) * (cx - x2) + (cy - y2) * (cy - y2) < r * r){
					return 0;
				}else {
					return rayCircle(cx, cy, dx, dy, x2, y2, r, 1);
				}
					
			} else {
				return 0;
			}
			
		}
	}
}

//Collision between line and rectangle
function lineXrect(lx1, ly1, lx2, ly2, rx, ry, w, h){
	//check if any of the line endpoints are within the rectangle
	if( lx1 >= rx && lx1 <= rx + w && ly1 >= ry && ly1 <= ry + h )
		return true;
	if( lx2 >= rx && lx2 <= rx + w && ly2 >= ry && ly2 <= ry + h )
		return true;
	//Check if the line intersects any of the ininite lines that the rectangle sides are part of, and check if the intersection point touches the rectangle
	if( (lx1 < rx) ^ (lx2 < rx) ){
		//line endpoints are on different sides of the rectangle's left side
		var iy = ly1 + (ly2 - ly1) * (rx - lx1) / (lx2 - lx1);//y of the intersection point between the line and the infinite line the left side of the rectangle is part of
		if( iy >= ry && iy <= ry + h )
			return true;
	}
	if( (lx1 < rx + w) ^ (lx2 < rx + w) ){
		//line endpoints are on different sides of the rectangle's right side
		var iy = ly1 + (ly2 - ly1) * (rx + w - lx1) / (lx2 - lx1);//y of the intersection point between the line and the infinite line the right side of the rectangle is part of
		if( iy >= ry && iy <= ry + h )
			return true;
	}
	
	if( (ly1 < ry) ^ (ly2 < ry) ){
		//line endpoints are on different sides of the rectangle's top side
		var ix = lx1 + (lx2 - lx1) * (ry - ly1) / (ly2 - ly1);//x of the intersection point between the line and the infinite line the top side of the rectangle is part of
		if( ix >= rx && ix <= rx + w )
			return true;
	}
	if( (ly1 < ry + h) ^ (ly2 < ry + h) ){
		//line endpoints are on different sides of the rectangle's bottom side
		var ix = lx1 + (lx2 - lx1) * (ry + h - ly1) / (ly2 - ly1);//x of the intersection point between the line and the infinite line the bottom side of the rectangle is part of
		if( ix >= rx && ix <= rx + w )
			return true;
	}
	return false;
}