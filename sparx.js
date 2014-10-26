function randomRange(a, b)
{
    return a + (Math.random()*(b-a+1));
}

var SPARX_SIGHT = 128;
var SPARX_REPOSITION_TIME = 100;
var SPARX_HUNT_TIME = 90;

function Sparx(){
    this.x = 0;
    this.y = 0;
    this.rdx = 0;
    this.rdy = 0;
    this.gem = null;
    this.butterfly = null;
    this.sprite = new Animation(sprSparx, ANIMATION_LOOP_MOVE);
    this.radius = 16;
    this.facing = 1;
    this.rTimer = new Timer(SPARX_REPOSITION_TIME);
    this.hTimer = new Timer(SPARX_HUNT_TIME);

    this.step = function(){
        // move sparx closer to butterfly, gem or spyro
        if(this.butterfly != null) this.moveToButterfly();
        else if(this.gem != null) this.moveToGem();
        else if(objSpyro != null) this.moveToSpyro();

        this.sprite.nextFrame();
    }

    this.moveToButterfly = function(){
        // move sparx to butterfly
        this.x += ((this.butterfly.x + this.butterfly.pdx) - this.x) * 0.25;
        this.y += ((this.butterfly.y + this.butterfly.pdy) - this.y) * 0.25;

        // look at butterfly
        if(this.x < this.butterfly.x) this.facing = 1;
        else this.facing = -1;

        // takes some time to hunt down the butterfly
        if(this.hTimer.tick()){
            if( objectCollide( this.butterfly, this ) ){
                this.butterfly.kill();
                this.butterfly = null;
            }
        }
    }

    this.moveToGem = function(){
        // move sparx to gem
        this.x += (this.gem.x - this.x) * 0.25;
        this.y += (this.gem.y - this.y) * 0.25;

        // look at gem
        if(this.x < this.gem.x) this.facing = 1;
        else this.facing = -1;

        // pick gem if collide
        if( objectCollide( this.gem, this ) ){
            this.gem.pick();
            this.gem = null;
        }
    }

    this.moveToSpyro = function(){
        // set random location around spyro
        if(this.rTimer.tick()){
            this.rdx = randomRange(-64, 64);
            this.rdy = randomRange(-64, 0);
        }

        // move sparx to spyro
        this.x += (objSpyro.x + this.rdx - this.x) * 0.2;
        this.y += (objSpyro.y + this.rdy - this.y) * 0.2;
        this.facing = objSpyro.facing;
    }

    this.notifyGemKilled = function(gem){
        if(gem == this.gem)
            this.gem = null;
    }

    this.notifyButterflyKilled = function(butterfly){
        if(butterfly == this.butterfly)
            this.butterfly = null;
    }

    this.draw = function(){
        this.sprite.drawExt(this.x, this.y, -this.facing, 1, 0);
    }
}
