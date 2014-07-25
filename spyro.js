
function Spyro(){
    this.x = 100;
	this.y = 100;
	this.xspeed = 0;
	this.yspeed = 0;
    this.maxXSpeed = 15;
	this.facing = -1;
	this.sprite = sprSpyro;
	this.frame = 0;
	this.animSpeed = 0.25;
	this.rotation = 0;
	this.radius = 32;
	this.acceleration = 3;
	
	this.jump = function(){
	    this.yspeed -= 17;
		audio.playSound(sndJump, 1, false);
	}

	this.step = function(){
	
		//Keyboard input and controls
		
		//Horizontal movement
		//(Don't let him accelerate past his max xspeed by walking, but still allow for higher speeds given from the environment)
		if( keyboard.isHeld(leftKey) ){
			this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);
			this.facing = -1;
		}
		if( keyboard.isHeld(rightKey) ){
			this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
			this.facing = 1;
		}
		
		//Vertical movement
		this.yspeed += gravity;
		
		//Stop in mid-air when holding space
		if( keyboard.isHeld(spaceKey) ){
			this.xspeed = 0;
			this.yspeed = 0;
		}
		
		//Movement and collision with terrain
		var speed = Math.sqrt(this.xspeed * this.xspeed + this.xspeed * this.xspeed);
		var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed);
		
		//--Check if Spyro is on the ground--
		var nearLinesNotOverlapping = nearLines.slice();//copies nearLines
		//Remove the lines that Spyro is currently overlapping, because that means they must be jump-through and that he is inside them, so they shouldn't be counted as ground
		levelPartRemoveCircle(nearLinesNotOverlapping, this.x, this.y, this.radius * 0.99);
		//Test with the remaining lines and a circle with a slightly reduced radius, moved down a small distance
		var onGround = circleXlevelPart(this.x, this.y + this.radius * 0.05 + 1, this.radius * 0.99 * 0.95, nearLinesNotOverlapping);
		
		
		var isCollision = objectXlevelPartCollision( this, nearLines );
		if( onGround )
		{
		    this.xspeed = slowDown( this.xspeed, 1.5 );
			if( keyboard.isPressed(upKey) ) this.jump();
		}
		
		this.frame += this.animSpeed;
	}
	
	this.draw = function(){
        //Make Spyro draw himself
        drawSprite(context, this.sprite, this.frame, this.x, this.y, -this.facing, 1, this.rotation);
		context.beginPath();
		context.arc(this.x,this.y,32,0,2*Math.PI);
		context.stroke();
		//Debug drawing
			//Draw some near lines
			var nearLines = levelPartCircle(this.x, this.y, this.radius * 2);
			var l = nearLines.length;
			context.strokeStyle = "red";
			context.beginPath();
			for(var n = 0; n < l; n++){
				var poly = objLevel.polygons[nearLines[n].polygonInd];
				var p1 = poly.points[nearLines[n].pointInd];
				var p2 = poly.points[(nearLines[n].pointInd + 1) % poly.points.length];
				context.moveTo(p1.x + poly.position.x, p1.y + poly.position.y);
				context.lineTo(p2.x + poly.position.x, p2.y + poly.position.y);
			}
			context.stroke();
			//Draw the area of the level that Spyro tests for lines in
			//(not completely accurate as this doesn't take his speed and therefore larger test radius, but it shows the size of the collision grid cells)
			var g = objLevel.collisionGrid;
			context.strokeRect(g.x + Math.floor((this.x - this.radius * 2 - g.x)/g.cellSize) * g.cellSize, 
				g.y + Math.floor((this.y - this.radius * 2 - g.y)/g.cellSize) * g.cellSize,
				Math.ceil((this.x + this.radius * 2 - g.x)/g.cellSize) * g.cellSize - Math.floor((this.x - this.radius * 2 - g.x)/g.cellSize) * g.cellSize, 
				Math.ceil((this.y + this.radius * 2 - g.y)/g.cellSize) * g.cellSize - Math.floor((this.y - this.radius * 2 - g.y)/g.cellSize) * g.cellSize);
			
		this.sprite = sprSpyro;
    }
}
