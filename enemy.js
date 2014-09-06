
function Enemy(){
	this.x = 0;
	this.y = 0;
	this.r = 32;
	this.spyro = null;
	this.sprite = sprEnemy;
	this.xspeed = 0;
	this.yspeed = 0;
	this.maxXSpeed = 10;
	this.acceleration = 1;
	this.radius = 32;
    this.alive = true;

	this.step = function(){
        if( !this.alive ) return;
	    if( this.spyro != null ){
		    if( this.x < this.spyro.x ) this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
		    if( this.x > this.spyro.x ) this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);
			    
			this.yspeed += gravity;
			
            var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
			var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed);
			var isCollision = objectXlevelPartCollision( this, nearLines );//objectXlevelCollision(this);
			if( isCollision )
		    {
                this.xspeed = slowDown( this.xspeed, 1.5 );
		    }
			
			//--Check if on ground, copied from spyro.js
			var nearLinesNotOverlapping = nearLines.slice();//copies nearLines
			levelPartRemoveCircle(nearLinesNotOverlapping, this.x, this.y, this.radius * 0.99);
			var onGround = circleXlevelPart(this.x, this.y + this.radius * 0.05 + 1, this.radius * 0.99 * 0.95, nearLinesNotOverlapping);
			
			//Jump randomly
			if( onGround && Math.random() < 0.1 ) this.yspeed -= 25; 
			
			//Check if spyro is near
			if( Math.abs( this.x - this.spyro.x ) < 128 && Math.abs( this.y - this.spyro.y ) < 128 ){
				//Change spyro's sprite to being hurt, and play a "scary" sound
				if( this.spyro.sprite != sprSpyroHurt ){
					this.spyro.sprite = sprSpyroHurt;
					audio.playSound(sndRumble, 1, false);
				}
			}
	    }
	}

    this.kill = function(){
        this.alive = false;
        // TODO: create gem
    }
	
	this.draw = function(){
        if( !this.alive ) return;
        drawSprite(context, this.sprite, 0, this.x, this.y, 1, 1, 0 );
	}
}
