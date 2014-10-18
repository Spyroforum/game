
var GEM_RADIUS = 12;

function Gem(){
    this.x = 0;
    this.y = 0;
    this.radius = GEM_RADIUS;
    this.xspeed = 0;
    this.yspeed = 0;
    this.picked = false;
    this.sprite = null;
    this.value = 1;    // number to be added to gem count when picked
    this.alive = true; // tells if the gem should be removed from the array
    this.sspeed = 0;   // move speed when picked by sparx
	this.settled = false; // whether the gem has settled in place or not

    this.init = function(){
        if( this.value == 1 )
            this.sprite = sprGemRed;
        else if( this.value == 2 )
            this.sprite = sprGemGreen;
        else if( this.value == 5 )
            this.sprite = sprGemBlue;
        else if( this.value == 10 )
            this.sprite = sprGemYellow;
        else if( this.value == 25 )
            this.sprite = sprGemPurple;

        this.sprite = new Animation(this.sprite);
    }

    this.step = function(){
        if( this.alive == false ) return;

        if( this.picked ){
            // jump when picked by sparx
            this.y += this.yspeed;
            this.yspeed = slowDown( this.yspeed, 0.5 );

            // move to spyro
            this.x += (objSpyro.x - this.x) * this.sspeed;
            this.y += (objSpyro.y - this.y) * this.sspeed;

            // increase move speed so spyro can't run away from the gem
            this.sspeed = speedUpPlus( this.sspeed, 0.02, 1 );
        } else {
            // If Sparx is not seeking any gem and sees this gem
            if( objSparx.gem == null ){
                if( objectCollideDistance( this, objSpyro, SPARX_SIGHT ) ){
                    objSparx.gem = this;
                }
            }

            if( ! this.settled ){
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

        // If Spyro picks this gem
        if( objectCollide( this, objSpyro ) ){
            this.kill();
        }
    }


    this.kill = function(){
        if( objSparx.gem == this ) objSparx.gem = null;
        this.alive = false;
        // TODO: increase gem count
    }


    this.draw = function(){
        if( this.alive == false || this.sprite == null ) return;
        this.sprite.draw(this.x, this.y);
    }
}
