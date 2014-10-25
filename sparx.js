function randomRange(a, b)
{
    return a + (Math.random()*(b-a+1));
}

var SPARX_SIGHT = 128;

function Sparx(){
    this.x = 0;
    this.y = 0;
    this.rdx = 0;
    this.rdy = 0;
    this.gem = null;
    this.timer = 100;
    this.sprite = new Animation(sprSparx, ANIMATION_LOOP_MOVE);
    this.radius = 16;

    this.step = function(){
        // move sparx to random location around spyro
        if( this.timer === 0 ){
            this.rdx = randomRange(-64, 64);
            this.rdy = randomRange(-64, 0);
            this.timer = 100;
        } else {
            this.timer--;
        }

        // move sparx closer to gem or spyro
        if( this.gem != null ){
            // move sparx to gem
            this.x += (this.gem.x - this.x) * 0.25;
            this.y += (this.gem.y - this.y) * 0.25;
            if( objectCollide( this.gem, this ) ){
                this.gem.pick();
                this.gem = null; // tell sparx to follow spyro again
            }
        } else {
            // move sparx to spyro
            if( objSpyro != null ){
                this.x += (objSpyro.x + this.rdx - this.x) * 0.2;
                this.y += (objSpyro.y + this.rdy - this.y) * 0.2;
            }
        }

        this.sprite.nextFrame();
    }

    this.draw = function(){
        this.sprite.drawExt(this.x, this.y, -objSpyro.facing, 1, 0);
    }
}
