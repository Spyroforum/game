var PARTICLE_DIGIT = 0;
var PARTICLE_BASKET = 1;
var PARTICLE_VASE = 2;
function BouncyParticle(x, y, sprite, type){
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.xspeed = 0;
    this.yspeed = 0;
    this.sprite = sprite;
	this.alive = true;
	this.stepsLeft = 1;
	this.gravityFactor = 1;
	this.type = type;
	
	if(type == PARTICLE_DIGIT){
		this.radius = GEM_RADIUS;
		this.xspeed = -2 + Math.random() * 4;
		this.yspeed = -10
		this.gravityFactor = 0.4;
		this.stepsLeft = 80;
		this.sprite = new Animation(sprite, ANIMATION_LOOP_R);
		this.sprite.animSpeed = 0.25;
	} else if(type == PARTICLE_BASKET || type == PARTICLE_VASE){
		this.radius = 16;
		this.xspeed = 5 - Math.random() * 10;
		this.yspeed = 5 + Math.random() * 5;
		this.gravityFactor = 0.4;
		this.stepsLeft = 50;
		this.rotation = Math.random() * 360;
		this.rotationSpeed = -20 + Math.random() * 40;
	}

    this.step = function(){
        
		this.yspeed += gravity * this.gravityFactor;

		var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
		var nearLines = levelPartCircle(this.x, this.y, this.radius * 2 + speed);
		var xs = this.xspeed, ys = this.yspeed;
		var isCollision = objectXlevelPartCollision( this, nearLines );

		if( isCollision ){
			this.xspeed = xs;
			this.yspeed = ys;
			this.bounce();
		}
		
		if( this.type == PARTICLE_DIGIT )
			this.sprite.nextFrame();
		else if( this.type == PARTICLE_BASKET || this.type == PARTICLE_VASE )
			this.rotation += this.rotationSpeed;
		
		this.stepsLeft--;
		if( this.stepsLeft<= 0 )
			this.alive = false;
    }
	
	this.bounce = function(){
		var speed = Math.sqrt(this.xspeed * this.xspeed + this.yspeed * this.yspeed);
		if( speed > 0 ){
			// Get the near lines outside of particle
			var nearLinesNotOverlapping = levelPartCircle(this.x, this.y, this.radius * 2 + speed); // <-- Get all near
			levelPartRemoveCircle(nearLinesNotOverlapping, this.x, this.y, this.radius * 0.99); // <-- remove those touching the particle
			
			// Find the nearest solid point
			var p = levelPartNearestPoint(nearLinesNotOverlapping, this.x, this.y, this.radius * 1.2);
			if( p != null ){
				
				var d, nx, ny, vx, vy;
				// Find the normal of solid
				nx = this.x - p.x;
				ny = this.y - p.y;
				d = Math.sqrt(nx * nx + ny * ny);
				nx /= d;
				ny /= d;
				
				vx = this.xspeed;
				vy = this.yspeed;
				
				// Reflect motion vector away from nearest solid point
				d = (vx * nx + vy * ny) * 2;
				this.xspeed = vx - (nx * d);
				this.yspeed = vy - (ny * d);
			}
		}
	}

    this.draw = function(){
        if( this.sprite == null ) return;
		if( this.type == PARTICLE_DIGIT )
			this.sprite.draw(this.x, this.y);
		else if( this.type == PARTICLE_BASKET || this.type == PARTICLE_VASE )
			drawSprite(context, this.sprite, 0, this.x, this.y, 1, 1, this.rotation);
    }
}
