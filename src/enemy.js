
function Enemy(){
	this.x = 0;
	this.y = 0;
    this.sprite = new Animation(sprEnemy);
	this.xspeed = 0;
	this.yspeed = 0;
	this.maxXSpeed = 10;
	this.acceleration = 1;
	this.radius = 32;
    this.alive = true;
    this.gemId = 0; // gem id unique within a level

    this.init = function(){
        this.gemId = objLevel.genGemId();
    }

	this.step = function(){
        if( !this.alive ) return;

        // accelerate to Spyro
        if( this.x < objSpyro.x ) this.xspeed = speedUpPlus(this.xspeed, this.acceleration, this.maxXSpeed);
        if( this.x > objSpyro.x ) this.xspeed = speedUpMinus(this.xspeed, this.acceleration, -this.maxXSpeed);

        this.yspeed += gravity;

        var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
        var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed);
        var isCollision = objectXlevelPartCollision( this, nearLines );
        if( isCollision ){
            this.xspeed = slowDown( this.xspeed, 1.5 );
        }

        //--Check if on ground, copied from spyro.js
        var nearLinesNotOverlapping = nearLines.slice(); // copies nearLines
        levelPartRemoveCircle(nearLinesNotOverlapping, this.x, this.y, this.radius * 0.99);
        var onGround = circleXlevelPart(this.x, this.y + this.radius * 0.05 + 1, this.radius * 0.99 * 0.95, nearLinesNotOverlapping);

        //Jump randomly
        if( onGround && Math.random() < 0.1 ) this.yspeed -= 25;

        if(isFlamed(this)) this.kill(false);
        if(isCharged(this)) this.kill(true);
	}

    /**
        Parameters:
            picked (boolean) - if the gem should be picked when created
    */
    this.kill = function(picked){
        objLevel.addGem(this.x, this.y, 0, -10, this.gemDrop, picked, this.gemId);
        this.alive = false;
    }


	this.draw = function(){
        if(!this.alive) return;
        this.sprite.draw(this.x, this.y);
	}
}
