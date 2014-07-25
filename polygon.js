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
		/*if( ! this.anySolid ){
			minx = 0;
			miny = 0;
			maxx = 0;
			maxy = 0;
		}*/
		this.boundingBox = {
					left:minx,
					top:miny,
					right:maxx,
					bottom:maxy
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
	this.drawDetailsLayer = function(layer){
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
	
	//Draw itself with both texture and details
	this.draw = function(){
		if( this.visible ){
			var offset_x = this.position.x;
			var offset_y = this.position.y;
			context.save();
			context.translate(offset_x, offset_y);
				
				this.drawDetailsLayer(0);//Back layer
				var l = this.points.length;
				context.beginPath();
				for(var n = 0; n < l; n++){
					context.lineTo(this.points[n].x, this.points[n].y);
				}
				
				context.fillStyle = this.bgColor;
				context.fill();	
				
				context.fillStyle = context.createPattern(this.texture.img,"repeat");
				context.globalCompositeOperation = 'lighter';
				context.globalAlpha = this.textureOpacity;
				context.fill();
				context.globalCompositeOperation = 'source-over';
				context.save();
					context.clip();
					this.drawDetailsLayer(1);//Inside/clipped layer
				context.restore();
				
				this.drawDetailsLayer(2);//Front layer
				
				
			context.restore();
		}
	}
	this.drawBoundingBox = function(){
		context.strokeRect(this.boundingBox.left + this.position.x, this.boundingBox.top + this.position.y, this.boundingBox.right - this.boundingBox.left,  this.boundingBox.bottom - this.boundingBox.top);
	}
	//Draw the polygon shape as a texture or outline
	// 'context' - the context of the canvas to draw to
	// 'texture' - if the polygon should be drawn with a specific texture, specify that here, otherwise leave set it to 'null'
	// 'outlineStyle' - the strokeStyle to draw the outline of the polygon with. Can be a color or a pattern. Or 'null'.
	//
	// If both 'texture' and 'outlineStyle' is set to 'null', the polygon is drawn with it's default texture.
	// If 'outlineStyle' is specified, only the outline is drawn.
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
}