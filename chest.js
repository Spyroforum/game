
function ChestBasket(){
    this.radius = 32;
    this.alive = true;
    this.sprite = new Animation(sprChestBasket);
    this.gemDrop = 1;

    this.step = function(){
        if(!this.alive) return;

        if(isFlamed(this)){
            objLevel.addGem(this.x, this.y, 0, -15, this.gemDrop, false);
            this.alive = false;
        }

        if(isCharged(this)){
            objLevel.addGem(this.x, this.y, 0, -15, this.gemDrop, true);
            this.alive = false;
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
    this.hot = 0;


    this.step = function(){
        if(!this.alive) return;

        if(isFlamed(this)){
            this.hot += 4; // heat up vase
            if(this.hot/10 >= this.sprite.frameCount()) this.hot = this.sprite.frameCount()*10 - 10;
        }
        else if(this.hot > 0){
            this.hot -= 1; // cool down vase
        }

        if(isCharged(this)){
            objLevel.addGem(this.x, this.y, 0, -15, this.gemDrop, true);
            this.alive = false;
        }
    }


    this.draw = function(){
        if(!this.alive) return;

        // set currnt frame depending on vase hotness
        this.sprite.frame = Math.floor(this.hot / 10);
        if(this.sprite.frame >= this.sprite.frameCount()) this.sprite.frame = this.sprite.frameCount()-1;

        this.sprite.draw(this.x, this.y);
    }
}


function ChestLife(){
    this.radius = 32;
    this.alive = true;
    this.sprite = new Animation(sprChestLife);

    this.step = function(){
        if(!this.alive) return;

        if(isFlamed(this) || isCharged(this)){
            objLevel.addButterfly(this.x, this.y, BUTTERFLY_LIFE);
            this.alive = false;
        }
    }

    this.draw = function(){
        this.sprite.draw(this.x, this.y);
    }
}
