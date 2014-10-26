
var BUTTERFLY_HEALTH = 0;
var BUTTERFLY_LIFE = 1;
var BUTTERFLY_DX_SIZE = 80;
var BUTTERFLY_DY_SIZE = 32;
var BUTTERFLY_AX_SPEED = 4; // degrees per step
var BUTTERFLY_AY_SPEED = 2; // degrees per step

function Butterfly(){
    this.x = 0;
    this.y = 0;
    this.dx = 0; // position deltas
    this.dy = 0;
    this.ax = 0; // angles for computing position delta
    this.ay = 0;
    this.pdx = 0; // previous dx/dy (used for sparx)
    this.pdy = 0;
    this.radius = 16;
    this.sprite = null;
    this.type = BUTTERFLY_HEALTH;
    this.runMult = 1;
    this.facing = 1;
    this.alive = true;

    this.init = function(){
        if(this.type == BUTTERFLY_HEALTH)
            this.sprite = new Animation(sprButterflyHealth, ANIMATION_LOOP_MOVE);
        else
            this.sprite = new Animation(sprButterflyLife, ANIMATION_LOOP_MOVE);
    }

    this.step = function(){
        if(!this.alive) return;

        // change position delta and facing
        this.pdx = this.dx;
        this.pdy = this.dy;
        this.ax = (this.ax + BUTTERFLY_AX_SPEED * this.runMult) % 360;
        this.ay = (this.ay + BUTTERFLY_AY_SPEED) % 360;
        this.dx = BUTTERFLY_DX_SIZE * Math.sin(this.ax * Math.PI / 180);
        this.dy = BUTTERFLY_DY_SIZE * Math.sin(this.ay * Math.PI / 180);
        if(this.ax <= 90 || this.ax > 270 )
            this.facing = -1;
        else
            this.facing = 1;

        this.sprite.nextFrame();
    }

    this.run = function(){
        this.runMult = 2;
    }

    this.kill = function(){
        objSparx.notifyButterflyKilled(this);

        if(this.type == BUTTERFLY_HEALTH){
            // TODO: increase spyro's health
        } else {
            // TODO: increase spyro's life
        }

        this.alive = false;
    }

    this.draw = function(){
        if(!this.alive) return;
        this.sprite.drawExt(this.x + this.dx, this.y + this.dy, this.facing, 1, 0);
    }
}
