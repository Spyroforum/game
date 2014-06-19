function GridLevel(blockSize,xSize,ySize){
	this.blockSize = blockSize;
	this.xSize = xSize;
	this.ySize = ySize;
	this.grid = new Array();
	for(var y=0;y<this.ySize;y++){
		this.grid[y] = new Array();
		for(var x=0;x<this.xSize;x++){
		
			this.grid[y][x] == 0;
		}
	}
	this.draw = function(x,y){
		ctx.fillStyle = 'rgb(50,200,100)'
		for(var xx=0;xx<this.xSize;xx++){
			for(var yy=0;yy<this.ySize;yy++){
				if(this.grid[yy][xx] == 1)
					ctx.fillRect(x+xx*this.blockSize, y+yy*this.blockSize, this.blockSize, this.blockSize);
			}
		}
	}
	this.collideRect = function(x,y,w,h){
		var minx, miny, maxx, maxy;
		minx=Math.max(0,Math.floor(x/this.blockSize));
		miny=Math.max(0,Math.floor(y/this.blockSize));
		maxx=Math.min(this.xSize,Math.ceil((x+w)/this.blockSize));
		maxy=Math.min(this.ySize,Math.ceil((y+h)/this.blockSize));
		for(var xx=minx;xx<maxx;xx++){
			for(var yy=miny;yy<maxy;yy++){
				if(this.grid[yy][xx] != 0) 
					return true;
			}
		}
		return false;
	}
}