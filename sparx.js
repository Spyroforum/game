function randomRange(a, b)
{
    return a + (Math.random()*(b-a+1));
}

function Sparx(){
    this.x = 0;
    this.y = 0;
    this.rdx = 0;
    this.rdy = 0;
    this.spyro = null;
    this.timer = 100;
    this.frame = 0;
    this.sprite = sprSparx;

    this.step = function(){
        // move sparx to random location around spyro
        if( this.timer === 0 ){
            this.rdx = randomRange(-64, 64);
            this.rdy = randomRange(-64, 0);
            this.timer = 100;
        }
        else{
            this.timer--;
        }

        // change sparx animation frame
        this.frame++;
        if(this.frame > 5)
            frame = 0;

        // move sparx closer to spyro
        if( this.spyro != null ){
            this.moveTo( this.spyro.x + this.rdx, this.spyro.y + this.rdy );
        }
    }

    this.draw = function(){
        drawSprite(context, this.sprite, this.frame, this.x, this.y, -this.spyro.facing, 1, 0 );
    }

    this.moveTo = function(a, b){
        /*if( this.x < a ){
            this.x += 8;
            if( this.x > a )
                this.x = a;
        }
        else if( this.x > a ){
            this.x -= 8;
            if( this.x < a )
                this.x = a;
        }

        if( this.y < b ){
            this.y += 8;
            if( this.y > b )
                this.y = b;
        }
        else if( this.y > b ){
            this.y -= 8;
            if( this.y < b )
                this.y = b;
        }*/
        
        this.x += (a - this.x) * 0.2;
        this.y += (b - this.y) * 0.2;
    }
}
