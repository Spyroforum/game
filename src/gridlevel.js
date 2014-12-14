function GridTerrain(blockSize, xSize, ySize){
	this.blockSize = blockSize;
	this.xSize = xSize;
	this.ySize = ySize;
	this.grid = null;

	this.draw = function(x, y){
		if( this.grid != null ){
            context.fillStyle = 'rgb(50, 200, 100)';
			for(var xx = 0; xx < this.xSize; xx++){
				for(var yy = 0; yy < this.ySize; yy++){
					if( this.grid[yy][xx] == 1 )
                        context.fillRect(x + xx * this.blockSize, y + yy * this.blockSize, this.blockSize, this.blockSize);
				}
			}
		}
	}
	
	this.collideRect = function(x, y, w, h){
		if( this.grid != null ){
			var minx, miny, maxx, maxy;
			minx = Math.max(0, Math.floor(x / this.blockSize));
			miny = Math.max(0, Math.floor(y / this.blockSize));
			maxx = Math.min(this.xSize, Math.ceil((x + w) / this.blockSize));
			maxy = Math.min(this.ySize, Math.ceil((y + h) / this.blockSize));
			for(var xx = minx; xx < maxx; xx++){
				for(var yy = miny; yy < maxy; yy++){
					if( this.grid[yy][xx] != 0 ) 
						return true;
				}
			}
		}
		return false;
	}
}
