
function PolygonLevel(){
	this.polygons = [];
	this.objects = [];
	this.collisionGrid = null;
	
	//Generate a collision grid, a rectangle covering all solid lines of polygons, split into smaller cells containing references to overlapping solid polygon lines
	//Each cell will contain an array. Each of those arrays(if there are any solid lines touching the cell), will consist of objects with a polygonInd property and a pointInd property
	//polygonInd is the index of the polygon that contains the line, while pointInd is the index of the line's first endpoint in that polygon's list of points.
	//Example: var poly = objLevel.polygons[polygonInd];
	//var point = poly.points[pointInd];
	this.generateCollisionGrid = function(cellSize){
		//Calculate the bounding box of the level
		var minx = 999999999;
		var miny = 999999999;
		var maxx = -999999999;
		var maxy = -999999999;
		var l = this.polygons.length;
		for(var n = 0; n < l; n++){
			var poly = this.polygons[n];
			if( poly.anySolid ){
				if( minx > poly.position.x + poly.boundingBox.left ) 
					minx = poly.position.x + poly.boundingBox.left;
				if( maxx < poly.position.x + poly.boundingBox.right) 
					maxx = poly.position.x + poly.boundingBox.right;
				if( miny > poly.position.y + poly.boundingBox.top ) 
					miny = poly.position.y + poly.boundingBox.top;
				if( maxy < poly.position.y + poly.boundingBox.bottom) 
					maxy = poly.position.y + poly.boundingBox.bottom;
			}
		}
		//Add this bounding box to the collision grid object
		var g = {
			x: minx,//top left corner x
			y: miny,//top left corner y
			width: maxx - minx,//width of the grid in pixels
			height: maxy - miny,//height
			cellSize: cellSize,//size of each cell in pixels
			cell: []
		}
		g.cellsX = Math.ceil(g.width / cellSize);//Number of columns
		g.cellsY = Math.ceil(g.height / cellSize);//Number of rows
		g.cell.length = g.cellsX;
		//Create the actual 2d grid/array, and add an array to each cell
		for(var x = 0; x < g.cellsX; x++){
			g.cell[x] = [];
			g.cell[x].length = g.cellsY;
			for(var y = 0; y < g.cellsX; y++){
				g.cell[x][y] = [];
			}
		}
		
		//Loop through polygons
		for(var n = 0; n < l; n++){
			var poly = this.polygons[n];
			if( poly.anySolid ){
				var numPoints = poly.points.length;
				//Loop through their lines
				for(var m = 0; m < numPoints; m++){
					var p1 = poly.points[m];
					if( p1.solid ){
						var p2 = poly.points[(m + 1) % numPoints];
						//Find the range of cells that the line might be overlapping
						var ax, ay, bx, by;
						ax = Math.max(0, Math.floor((Math.min(p1.x, p2.x) + poly.position.x - g.x) / cellSize));
						bx = Math.min(g.cellsX, Math.ceil((Math.max(p1.x, p2.x) + poly.position.x - g.x) / cellSize));
						ay = Math.max(0, Math.floor((Math.min(p1.y, p2.y) + poly.position.y - g.y) / cellSize));
						by = Math.min(g.cellsY, Math.ceil((Math.max(p1.y, p2.y) + poly.position.y - g.y) / cellSize));
						
						//Loop through those cells
						for(var x = ax; x < bx; x++){
							for(var y = ay; y < by; y++){
								//Check if the line actually intersects with the cell
								if( lineXrect(p1.x, p1.y, p2.x, p2.y, (g.x + x * cellSize - poly.position.x), (g.y + y * cellSize - poly.position.y), cellSize, cellSize) ){
									//Add the line to the list of lines in the current cell, as array indexes that point to the line
									var lineRef = {
										polygonInd: n,//This polygon's position in the level's array of polygons
										pointInd: m//Position of this line's first endpoint in the polygon's array of points
									}
									g.cell[x][y].push(lineRef);
								}
							}
						}
					}
				}
			}
		}
		this.collisionGrid = g;
	}
	
	//Create a list for each object type. These can then be accessed with(for example): this.Spyro[0], or this.Gem[n] where n is gem number n in the level.
	//Or they can be accessed the way they are created, bracket style: this["Spyro"][0] or this["Gem"][n]
	for(var n = 0; n < objectTypes.length; n++){
		this[objectTypes[n].name] = [];
	}
	
	this.init = function(){
		//Do stuff in addition to loading the contents of a level.
		
		//Make all polygons calculate their bounding boxes
		var l = this.polygons.length;
		for(var n = 0; n < l; n++){
			this.polygons[n].calculateBoundingBox();
		}
		//Generate collision grid
		this.generateCollisionGrid(200);
		
		objSpyro = this.Spyro[0];
		
		objCamera.target = objSpyro;
		
		//Create sparx and tell him what object is Spyro
		objSparx.spyro = objSpyro;
		this.objects.push(objSparx);
		
		//Tell all enemies what object is Spyro
		for(var n = 0; n < this.Enemy.length; n++){
			this.Enemy[n].spyro = objSpyro;
		}
	}
	
	this.step = function(){
		
		//Make all objects in the level run their step function
		l = this.objects.length;
		for(var n = 0; n < l; n++){
			this.objects[n].step();
		}
	}
	
	this.draw = function(){
		context.save();
		//Draw all polygons
		var l = this.polygons.length;
		for(var n = 0; n < l; n++){
			this.polygons[n].draw(context);
		}
		
		
		//Draw all objects
		l = this.objects.length;
		for(var n = 0; n < l; n++){
			this.objects[n].draw();
		}
		context.restore();
	}
	
	this.loadString = function(str){
		
		//Load polygons
		
		var ind = str.indexOf("@Polygon{");
		while( ind != -1 ){
			str = str.substring(ind, str.length);
			var poly = new Polygon;
			this.polygons.push(poly);
			
			//Basic properties
			
			poly.position.x = parseFloat(str.substring(str.indexOf("x:") + 2 , str.indexOf("£"))); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.position.y = parseFloat(str.substring(str.indexOf("y:") + 2 , str.indexOf("£"))); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.jumpThrough = ( str.substring(str.indexOf("jumpThrough:") + 12 , str.indexOf("£")) == "true" );  
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.visible = ( str.substring(str.indexOf("visible:") + 8 , str.indexOf("£")) == "true" ); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.bgColor = str.substring(str.indexOf("bgColor:") + 8 , str.indexOf("£")); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.texture = resources.getFromString( str.substring(str.indexOf("texture:") + 8 , str.indexOf("£")) );
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.textureOpacity = parseFloat(str.substring(str.indexOf("textureOpacity:") + 15 , str.indexOf("£"))); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.points.length = 0;
			
			//Points
			
			var  ind2 = str.indexOf("^point{");
			while( ind2 != -1 ){
				str = str.substring(ind2, str.length);
				var point = poly.addPoint(0, 0, true);
				
				point.x = parseFloat(str.substring(str.indexOf("x:") + 2 , str.indexOf("£"))); 
				str = str.substring(str.indexOf("£") + 1, str.length); 
				
				point.y = parseFloat(str.substring(str.indexOf("y:") + 2 , str.indexOf("£"))); 
				str = str.substring(str.indexOf("£") + 1, str.length); 
				
				point.solid = ( str.substring(str.indexOf("solid:") + 6 , str.indexOf("£")) == "true" );  
				str = str.substring(str.indexOf("£") + 1, str.length); 
				
				ind2 = str.indexOf("^point{");
				if( ind2 > str.indexOf("^details1{") )
					ind2 = -1;
			}
			
			//Details
			
			for(var n = 0; n < 3; n++){
				poly.details[n].length = 0;
				ind2 = str.indexOf("^details" + (n + 1) + "{");
				while( ind2 != -1 ){
					if( str.indexOf("^details" + (n + 1) + "{}") == ind2 )
						break;

					str = str.substring(ind2, str.length);
					var detail = poly.addDetail(n, null, 0, 0, 1, 1, 0, 1);
					
					detail.x = parseFloat(str.substring(str.indexOf("x:") + 2 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length); 
					
					detail.y = parseFloat(str.substring(str.indexOf("y:") + 2 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length); 
					
					detail.dtl = resources.getFromString( str.substring(str.indexOf("dtl:") + 4 , str.indexOf("£")) );
					for( var m = 0; m < resources.details.length; m++){//Find the index of the detail
						if( resources.details[m] == detail.dtl ){
							detail.dtl = m;
							break;
						}
					}
					str = str.substring(str.indexOf("£") + 1, str.length); 
					
					detail.xscale = parseFloat(str.substring(str.indexOf("xscale:") + 7 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					detail.yscale = parseFloat(str.substring(str.indexOf("yscale:") + 7 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					detail.angle = parseFloat(str.substring(str.indexOf("angle:") + 6 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					detail.opacity = parseFloat(str.substring(str.indexOf("opacity:") + 8 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					ind2 = str.indexOf("^detail{");
					if( ind2 > str.indexOf("^details") )
						ind2 = -1;
				}
			}
			ind = str.indexOf("@Polygon{");
		}
		
		//Load objects
		
		ind = str.indexOf("@");
		while( ind != -1 ){
			var typeName = str.substring(ind + 1, str.indexOf("[",ind));
			var type;
			var typeInd;
			var l = objectTypes.length;
			for(var n = 0; n < l; n++){
				if( objectTypes[n].name == typeName ){
					type = objectTypes[n];
					typeInd = n;
					break;
				}
			}
			
			//Basic properties(position)
			
			var ind2 = str.indexOf("]",ind);
			var obj = new type.constr();
			this.objects.push(obj);
			this[typeName].push(obj);
			
			obj.x = parseFloat(str.substring(str.indexOf("x:", ind) + 2 , str.indexOf("£", ind))); 
			ind = str.indexOf("£", ind) + 1; 
			
			obj.y = parseFloat(str.substring(str.indexOf("y:", ind) + 2 , str.indexOf("£", ind))); 
			ind = str.indexOf("£", ind) + 1; 
			
			//Custom properties
			for(var m = 0; m < type.properties.length; m++){
				var prop = type.properties[m];
				var propInd = str.indexOf(type.properties[m].name + ":", ind);
				
				if( propInd != -1 && propInd < ind2 ){
					var a = str.substring(str.indexOf(type.properties[m].name + ":", ind) + type.properties[m].name.length + 1 , str.indexOf("£", ind)); 
					if( isNaN(parseFloat(a)) )//If the property is a string, keep it that way
						obj[type.properties[m].name] = a;
					else//Otherwise, turn the string representation of a value into an actual value
						obj[type.properties[m].name] = parseFloat(a);
						
					ind = str.indexOf("£", ind) + 1;
				}				
			}
			ind = str.indexOf("@", ind);
		}
	}
}
