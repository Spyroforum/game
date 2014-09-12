function Camera(){
	this.x = 0;
	this.y = 0;
	this.target = null;

	this.step = function(){
        this.x = this.target.x - screenWidth / 2;
        this.y = this.target.y - screenHeight / 2;
	}
	this.setView = function(context){
		context.setTransform(1, 0, 0, 1, 0, 0);//Clear all previous transformation
		context.translate( -this.x, -this.y);
	}
}
