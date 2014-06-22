
function Enemy(){
	this.x = 0;
	this.y = 0;
	this.r = 32;
	this.spyro = null;
	this.speed = 2;
	this.sprite = sprEnemy;

	this.step = function(){
		with(this)
		{
		    if( spyro != null ){
			    if( x < spyro.x )
				    x += speed;
			    if( x > spyro.x )
				    x -= speed;
			    if( y < spyro.y )
				    y += speed;
			    if( y > spyro.y )
				    y -= speed;
				
				//Check if spyro is near
				if( Math.abs( x - spyro.x ) < 128 && Math.abs( y - spyro.y ) < 128 ){
				
					//Change spyro's sprite to being hurt, and play a "scary" sound
					if( spyro.sprite != sprSpyroHurt ){
						spyro.sprite = sprSpyroHurt;
						audio.playSound(sndRumble, 1, false);
					}
					
				} else spyro.sprite = sprSpyro;//Change spyro back to his normal sprite if he is too far away
		    }
		}
	}
	
	this.draw = function(){
		drawSprite(ctx, this.sprite, 0, this.x, this.y, 1, 1, 0 );
	}
}
