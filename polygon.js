function Polygon(x, y){
	//List of points that make out the polygon
	this.position = new Point(x, y);
	this.jumpThrough = false;
	this.points = [];
	this.bgColor = "black";
	this.texture = texDesert;
	this.textureOpacity = 1;
	this.details = [[], [], []];//Back layer of Details, clipped layer of Details and front layer of Details
	this.visible = true;
	this.anySolid = false;
	this.boundingBox = null;
	this.graphicalBoundingBox = null;
	this.cacheCanvas = null;
	
	//Bounding box of solid lines, and check if the polygon is solid at all
	this.calculateBoundingBox = function(){
		var minx = 999999999;
		var miny = 999999999;
		var maxx = -999999999;
		var maxy = -999999999;
		var l = this.points.length;
		this.anySolid = false;
		for(var n = 0; n < l; n++){
			var p = this.points[n];
			//If this point or the previous point is solid, then this point is part of a solid line and should affect the bounding box
			if( p.solid || this.points[(n - 1 + l) % l].solid ){
				if( p.x < minx ) minx = p.x;
				if( p.x > maxx ) maxx = p.x;
				if( p.y < miny ) miny = p.y;
				if( p.y > maxy ) maxy = p.y;
				this.anySolid = true;
			}
		}
		this.boundingBox = {
			left:minx,
			top:miny,
			right:maxx,
			bottom:maxy
			};
	}
	//Graphical bounding box
	this.calculateGraphicalBoundingBox = function(){
		var minx = 999999999;
		var miny = 999999999;
		var maxx = -999999999;
		var maxy = -999999999;
		//Polygon
		var l = this.points.length;
		for(var n = 0; n < l; n++){
			var p = this.points[n];
			if( p.x < minx ) minx = p.x;
			if( p.x > maxx ) maxx = p.x;
			if( p.y < miny ) miny = p.y;
			if( p.y > maxy ) maxy = p.y;
		}
		//Back and front layer of details
		for(var layer = 0; layer < 3; layer += 2){
			
			var dtl = this.details[layer];
			var l = dtl.length;
			for(var n = 0; n < l; n++){
				var dt = dtl[n];
				var detail = resources.details[dt.dtl];
				var img = detail.img;
				
				var rx = Math.cos(dt.angle * Math.PI / 180);
				var ry = Math.sin(dt.angle * Math.PI / 180);
				
				var a = (img.width - detail.originX) * dt.xscale;
				var b = (img.height - detail.originY) * dt.yscale;
				var c = (detail.originX - img.width) * dt.xscale;
				var d = (detail.originY - img.height) * dt.yscale;
				
				//Rotated corner positions
				var x1 = rx * a - ry * b;
				var y1 = ry * a - rx * b;
				var x2 = rx * c - ry * b;
				var y2 = ry * c - rx * b;
				var x3 = rx * c - ry * d;
				var y3 = ry * c - rx * d;
				var x4 = rx * a - ry * d;
				var y4 = ry * a - rx * d;
				
				minx = Math.min(minx, Math.min(x1, x2, x3, x4) + dt.x);
				miny = Math.min(miny, Math.min(y1, y2, y3, y4) + dt.y);
				maxx = Math.max(maxx, Math.max(x1, x2, x3, x4) + dt.x);
				maxy = Math.max(maxy, Math.max(y1, y2, y3, y4) + dt.y);
			}
		}
		
		this.graphicalBoundingBox = {
			left:minx,
			top:miny,
			right:maxx,
			bottom:maxy,
			};
	}
	
	//Add a point to the end of the list of points
	this.addPoint = function(newx, newy, newsolid){
		var point = new Point(newx, newy);
		point.solid = newsolid;
		this.points.push(point);
		return point;
	}
	
	//Add a detail to one of the detail layers of this polygon
	this.addDetail = function(layer, dtl, x, y, xscale, yscale, angle, opacity){
		var detail = new Point(x, y);
		detail.dtl = dtl;
		detail.xscale = xscale;
		detail.yscale = yscale;
		detail.angle = angle;
		detail.opacity = opacity;
		this.details[layer].push(detail);
		return detail;
	}
	
	//Draw one of the detail layers of this polygon
	this.drawDetailsLayer = function(layer, context){
		var l2 = this.details[layer].length;
		for(var m = 0; m < l2; m++){
			var detail = this.details[layer][m];
			var dtl = resources.details[detail.dtl];
			context.save();
			context.globalAlpha = detail.opacity;
			context.translate(detail.x, detail.y);
			context.rotate(detail.angle * Math.PI / 180);
			context.scale(detail.xscale, detail.yscale);
			context.drawImage(dtl.img, -dtl.originX, -dtl.originY);
			context.restore();
		}
	}
	
	/**
		Draw itself
		
		Draws polygon shape and detail layers if
			- drawing to a different canvas than the main game canvas(i.e. it's cache canvas)
			- selected in the level editor, because in this case it needs to be dynamic
		Draws it's cacheCanvas if
			- in the game
			- in the level editor, but is not selected
			
		If trying to draw cacheCanvas, but the polygon isn't cached, it will cache 
		itself first(draw polygon shape and details to cacheCanvas), and then draw the cached image
	*/
	this.draw = function(ctx){
		if( ctx == null )
			ctx = context;//Set to game canvas context if not specified
			
		var c = 0;//Game, draw cached 
		if( ctx != context)
			c = 2;//drawing to cache canvas
		else if( objEditor != null){
			c = 1;//Editor, not selected, so draw cached 
			var l = objEditor.selected.length;
			for(var n = 0; n < l; n++){
				if( objEditor.selected[n] == this ){
					this.unCache();
					c = 2;//is probably being edited, so draw all graphics, uncached
					break;
				}
			}
		}
			
		if( c == 2 ){
			if( this.visible ){
				var offset_x = this.position.x;
				var offset_y = this.position.y;
				ctx.save();
				ctx.translate(offset_x, offset_y);
					
					this.drawDetailsLayer(0, ctx);//Back layer
					
					var l = this.points.length;
					ctx.beginPath();
					for(var n = 0; n < l; n++){
						ctx.lineTo(this.points[n].x, this.points[n].y);
					}
					
					ctx.fillStyle = this.bgColor;
					ctx.fill();	
					
					ctx.fillStyle = ctx.createPattern(this.texture.img,"repeat");
					ctx.globalCompositeOperation = 'lighter';
					ctx.globalAlpha = this.textureOpacity;
					ctx.fill();
					ctx.globalCompositeOperation = 'source-over';
					ctx.save();
						ctx.clip();
						this.drawDetailsLayer(1, ctx);//Inside/clipped layer
					ctx.restore();
					
					this.drawDetailsLayer(2, ctx);//Front layer
					
					
				ctx.restore();
			}
		} else {
			
			if( c == 0){
				var minx = this.position.x + this.graphicalBoundingBox.left;
				var miny = this.position.y + this.graphicalBoundingBox.top;
				var maxx = this.position.x + this.graphicalBoundingBox.right;
				var maxy = this.position.y + this.graphicalBoundingBox.bottom;
				var cx = minx + (maxx - minx) / 2;//Polygon center position
				var cy = miny + (maxy - miny) / 2;
				var hw = cx - minx;//half width
				var hh = cy - miny;//half height
				var scx = objCamera.x + screenWidth / 2;//Screen center position
				var scy = objCamera.y + screenHeight / 2;
				if( Math.abs(cx - scx) < hw + screenWidth && Math.abs(cy - scy) < hh + screenHeight ){
					if( this.cacheCanvas == null )
						this.cacheToCanvas();
					if( Math.abs(cx - scx) < hw + screenWidth / 2 && Math.abs(cy - scy) < hh + screenHeight / 2 )
						ctx.drawImage(this.cacheCanvas, minx, miny);
				} else if( Math.abs(cx - scx) > hw + screenWidth * 1.5 || Math.abs(cy - scy) > hh + screenHeight * 1.5 )
					this.unCache();
			} else {
				if( this.cacheCanvas == null ){
					this.calculateGraphicalBoundingBox();
					this.cacheToCanvas();
				}
				var minx = this.position.x + this.graphicalBoundingBox.left;
				var miny = this.position.y + this.graphicalBoundingBox.top;
				ctx.drawImage(this.cacheCanvas, minx, miny);
			}
		}
	}
	this.drawBoundingBox = function(){
		context.strokeRect(this.boundingBox.left + this.position.x, this.boundingBox.top + this.position.y, this.boundingBox.right - this.boundingBox.left,  this.boundingBox.bottom - this.boundingBox.top);
	}
	/**
		Draw the polygon shape as a texture or outline
		'context' - the context of the canvas to draw to
		'texture' - if the polygon should be drawn with a specific texture, specify that here, otherwise leave set it to 'null'
		'outlineStyle' - the strokeStyle to draw the outline of the polygon with. Can be a color or a pattern. Or 'null'.
		
		If both 'texture' and 'outlineStyle' is set to 'null', the polygon is drawn with it's default texture.
		If 'outlineStyle' is specified, only the outline is drawn.
	*/
	this.drawPolygon = function(context, texture, outlineStyle){
	
		var l = this.points.length;
		if( l > 0){
			var offset_x = this.position.x;
			var offset_y = this.position.y;
			context.save();
			context.translate(offset_x, offset_y);
			
			context.beginPath();
			for(var n = 0; n < l; n++){
				context.lineTo(this.points[n].x, this.points[n].y);
			}
			context.closePath();
			
			if( outlineStyle != null ){
				context.globalAlpha = 1;
				context.globalCompositeOperation = 'source-over';
				context.strokeStyle = outlineStyle;
				context.lineWidth = 1;
				context.stroke();
			} else {
				if( texture != null){
					context.fillStyle = context.createPattern(texture.img,"repeat");
					context.globalAlpha = 0.5;
					context.fill();						
				} else if( this.texture != null){
					if( this.visible ){
						context.fillStyle = this.bgColor;
						context.fill();	
						
						context.fillStyle = context.createPattern(this.texture.img,"repeat");
						context.globalCompositeOperation = 'lighter';
						context.globalAlpha = this.textureOpacity;
						context.fill();
					} else {
						context.fillStyle = "rgba(127,127,127,0.5)";
						context.fill();
					}
				}
				
			}
			context.restore();
		}
	}
	
	
	/**
		Makes the polygon draw itself to its own cache canvas
	*/
	this.cacheToCanvas = function(){
		var minx = this.graphicalBoundingBox.left;
		var miny = this.graphicalBoundingBox.top;
		var maxx = this.graphicalBoundingBox.right;
		var maxy = this.graphicalBoundingBox.bottom;
		this.cacheCanvas = document.createElement("CANVAS"); 
		this.cacheCanvas.width = (maxx - minx);
		this.cacheCanvas.height = (maxy - miny);
		var ctx = this.cacheCanvas.getContext("2d");
		var x = this.position.x;
		var y = this.position.y;
		this.position.x = -minx;// Temporarily set the position of the polygon when drawing to cacheCanvas
		this.position.y = -miny;
		this.draw(ctx);
		this.position.x = x;
		this.position.y = y;
	}
	/**
		Removes the polygon's cache canvas
	*/
	this.unCache = function(){
		this.cacheCanvas = null;
	}
}