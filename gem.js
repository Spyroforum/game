
function Gem(){
    this.x = 0;
    this.y = 0;
    this.radius = 12;
    this.xspeed = 0;
    this.yspeed = 0;
    this.spyro = null;
    this.sprite = sprGemRed;
    this.value = 1;    // number to be added to gem count when picked
    this.alive = true; // tells if the gem should be removed from the array
    this.sspeed = 0;   // move speed when picked by sparx
	this.settled = false; // whether the gem has settled in place or not

    this.step = function(){
        if( this.alive == false ) return;

        if( this.spyro != null ){
            // jump when picked by sparx
            this.y += this.yspeed;
            this.yspeed = slowDown( this.yspeed, 0.5 );

            // move to spyro
            this.x += (this.spyro.x - this.x) * this.sspeed;
            this.y += (this.spyro.y - this.y) * this.sspeed;

            // increase move speed so spyro can't run away from the gem
            this.sspeed = speedUpPlus( this.sspeed, 0.02, 1 );
        } else if( ! this.settled ){
			this.yspeed += gravity;

            var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
            var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed);
            var isCollision = objectXlevelPartCollision( this, nearLines );
			
            if( isCollision ){
                // slow down
				var ret = slowDownXY( this.xspeed, this.yspeed, 2 );
				this.xspeed = ret.xspeed;
				this.yspeed = ret.yspeed;
				
				if( this.xspeed == 0 && this.yspeed == 0 )
					this.settled = true; // stop moving, and don't do more collision checking with the terrain
            }
        }
    }


    this.draw = function(){
        if( this.alive == false || this.sprite == null ) return;
        drawSprite( context, this.sprite, 0, this.x, this.y, 1, 1, 0 );
    }
}
