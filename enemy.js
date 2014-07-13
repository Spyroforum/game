
function Enemy(){
	this.x = 0;
	this.y = 0;
	this.r = 32;
	this.spyro = null;
	this.sprite = sprEnemy;
	this.xspeed = 0;
	this.yspeed = 0;
	this.maxXSpeed = 5;
	this.acceleration = 3;
	this.radius = 32;

	this.step = function(){
	    if( this.spyro != null ){
		    if( this.x < this.spyro.x ) this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
		    if( this.x > this.spyro.x ) this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);
			    
			this.yspeed += gravity;
			
			var isCollision = objectXlevelCollision(this);
			if( isCollision )
		    {
		        this.xspeed = slowDown( this.xspeed, 1.5 );
		    }

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
	
	this.draw = function(){
        drawSprite(context, this.sprite, 0, this.x, this.y, 1, 1, 0 );
	}
}
