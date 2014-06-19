
function Enemy(){
	this.x = 0;
	this.y = 0;
	this.r = 32;
	this.spyro = null;
	this.speed = 2;
	this.sprite = loadSprite("graphics/enemy.png", 1, 64, 64, 32, 32, 0);

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
		    }
		}
	}
	
	this.draw = function(){
	    drawSprite(ctx, this.sprite, 0, this.x, this.y, 1, 1, 0 );
	}
}
