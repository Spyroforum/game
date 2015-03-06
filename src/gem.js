
var GEM_RADIUS = 12;
var GEM_PICK_SPEED = -10;

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
    this.id = 0; // gem id unique within a level

    this.init = function(){
        if(objLevel.initialised === false){
            // cannot assign id ingame, only at the very beginning of a level
            this.id = objLevel.genGemId();
            if(saveData.isGemCollected(objLevel.id, this.id))
                this.alive = false;
        }
		
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

        this.sprite = new Animation(this.sprite, ANIMATION_LOOP_R);
		this.sprite.randomFrame();
		this.sprite.animSpeed = 0.5 - Math.round(Math.random());
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
		
		this.sprite.nextFrame();
        // If Spyro picks this gem
        if( objectCollide( this, objSpyro ) ){
            this.kill();
        }
    }


    this.kill = function(){
		if( this.value == 1 ){
            objLevel.objects.push(new BouncyParticle(this.x, this.y, sprDigit1, PARTICLE_DIGIT));
        } else if( this.value == 2 ){
            objLevel.objects.push(new BouncyParticle(this.x, this.y, sprDigit2, PARTICLE_DIGIT));
        } else if( this.value == 5 ){
            objLevel.objects.push(new BouncyParticle(this.x, this.y, sprDigit5, PARTICLE_DIGIT));
        } else if( this.value == 10 ){
            objLevel.objects.push(new BouncyParticle(this.x - 18, this.y, sprDigit1, PARTICLE_DIGIT));
			objLevel.objects.push(new BouncyParticle(this.x + 18, this.y, sprDigit0, PARTICLE_DIGIT));
        } else if( this.value == 25 ){
            objLevel.objects.push(new BouncyParticle(this.x - 18, this.y, sprDigit2, PARTICLE_DIGIT));
			objLevel.objects.push(new BouncyParticle(this.x + 18, this.y, sprDigit5, PARTICLE_DIGIT));
		}
			
        saveData.setGemCollected(objLevel.id, this.id, this.value);
        objSparx.notifyGemKilled(this);
        objCamera.infoPanelGems.show();
        this.alive = false;
    }


    this.pick = function(){
        this.picked = true;
        this.yspeed = GEM_PICK_SPEED;
    }


    this.draw = function(){
        if( this.alive == false || this.sprite == null ) return;
        this.sprite.draw(this.x, this.y);
    }
}
