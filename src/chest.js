
function ChestBasket(){
    this.radius = 32;
    this.alive = true;
    this.sprite = new Animation(sprChestBasket);
    this.gemDrop = 1;
    this.gemId = 0;  // gem id unique within a level
    this.id = 0; // chest id unique within a level

    this.init = function(){
        this.id = objLevel.genChestId();
        this.gemId = objLevel.genGemId();

        if(saveData.isChestCollected(objLevel.id, this.id)){
            this.alive = false;
            if(!saveData.isGemCollected(objLevel.id, this.gemId))
                objLevel.addGem(this.x, this.y, 0, 0, this.gemDrop, false, this.gemId);
        }
    }

    this.step = function(){
        if(!this.alive) return;

        if(isFlamed(this)) this.kill(false);
        if(isCharged(this)) this.kill(true);
    }

    /**
        Parameters:
            picked (boolean) - if the gem should be picked when created
    */
    this.kill = function(picked){
		this.breakEffect();
        objLevel.addGem(this.x, this.y, 0, -15, this.gemDrop, picked, this.gemId);
        saveData.setChestCollected(objLevel.id, this.id);
        this.alive = false;
    }
	
	this.breakEffect = function(){
		for(var i = 0; i < 5; i++){
			objLevel.objects.push(new BouncyParticle(this.x - 20 + Math.random() * 40, this.y - 20 + Math.random() * 40, sprBasketParticle, PARTICLE_BASKET));
		}
	}

    this.draw = function(){
        if(!this.alive) return;
        this.sprite.draw(this.x, this.y);
    }
}


function ChestVase(){
    this.radius = 24;
    this.alive = true;
    this.sprite = new Animation(sprChestVase);
    this.gemDrop = 1;
    this.gemId = 0;  // gem id unique within a level
    this.id = 0; // chest id unique within a level
    this.hot = 0;

    this.init = function(){
        this.id = objLevel.genChestId();
        this.gemId = objLevel.genGemId();

        if(saveData.isChestCollected(objLevel.id, this.id)){
            this.alive = false;
            if(!saveData.isGemCollected(objLevel.id, this.gemId))
                objLevel.addGem(this.x, this.y, 0, 0, this.gemDrop, false, this.gemId);
        }
    }

    this.step = function(){
        if(!this.alive) return;

        if(isFlamed(this)){
            this.hot += 4; // heat up vase
            if(this.hot/10 >= this.sprite.frameCount()) this.hot = this.sprite.frameCount()*10 - 10;
        }
        else if(this.hot > 0){
            this.hot -= 1; // cool down vase
        }

        if(isCharged(this)) this.kill(true);
    }

    this.kill = function(picked){
        objLevel.addGem(this.x, this.y, 0, -15, this.gemDrop, picked, this.gemId);
        saveData.setChestCollected(objLevel.id, this.id);
        this.alive = false;
    }

    this.draw = function(){
        if(!this.alive) return;

        // set currnt frame depending on vase hotness
        this.sprite.goToFrame(Math.floor(this.hot / 10));
        if(this.sprite.frame >= this.sprite.frameCount()) this.sprite.goToFrame(this.sprite.frameCount()-1);

        this.sprite.draw(this.x, this.y);
    }
}


function ChestLife(){
    this.radius = 32;
    this.alive = true;
    this.sprite = new Animation(sprChestLife);
    this.spriteB = new Animation(sprButterflyLife, ANIMATION_LOOP_RL);
    this.id = 0; // chest id unique within a level

    this.init = function(){
        this.id = objLevel.genChestId();

        if(saveData.isChestCollected(objLevel.id, this.id)){
            this.alive = false;
        }
    }

    this.step = function(){
        if(!this.alive) return;

        if(isFlamed(this) || isCharged(this)) this.kill();

        this.spriteB.nextFrame();
    }

    this.kill = function(){
        objLevel.addButterfly(this.x, this.y, BUTTERFLY_LIFE);
        saveData.setChestCollected(objLevel.id, this.id);
        this.alive = false;
    }

    this.draw = function(){
        this.spriteB.draw(this.x, this.y + 16);
        this.sprite.draw(this.x, this.y);
    }
}
