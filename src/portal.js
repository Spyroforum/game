
function Portal(){
    this.targetId = null;
	this.width = 130;
	this.height = 160;
    this.gemDrop = 1;

    this.step = function(){
    }

    this.draw = function(){
        context.save();
			context.beginPath();
			// Bottom left point
			context.moveTo(this.x-this.width/2*0.6,this.y+this.height/2);
			// Left point
			context.lineTo(this.x-this.width/2,this.y-this.height*0.1);
			// Top point
			context.lineTo(this.x,this.y-this.height/2);
			// Right point
			context.lineTo(this.x+this.width/2,this.y-this.height*0.1);
			// Bottom right point
			context.lineTo(this.x+this.width/2*0.6,this.y+this.height/2);
			// Bottom left point again
			context.lineTo(this.x-this.width/2*0.6,this.y+this.height/2);
			context.clip();
			drawSprite(context,sprSky[this.targetId],0,objCamera.x, objCamera.y,1,1,0);
		context.restore();
    }
}