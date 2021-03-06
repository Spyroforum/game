
var CAMERA_FADE_SPEED = 0.06;

function Camera(){
    this.x = 0;
    this.y = 0;
    this.target = null; // requires: x, y
    this.fadeAlpha = 0;
    this.fadeSpeed = 0;
    this.fadeOutEvent = null;
    this.infoPanelGems = new InfoPanel();
    this.infoPanelLives = new InfoPanel();

    this.step = function(){
        // update camera position
        if(this.target != null){
            this.x = this.target.x - screenWidth / 2;
            this.y = this.target.y - screenHeight / 2;
        }

        // update fade out/in
        if(this.fadeSpeed > 0){ // fade out
            if(this.fadeAlpha >= 1){
                if(this.fadeOutEvent != null) this.fadeOutEvent();
                this.fadeIn();
            } else {
                this.fadeAlpha += this.fadeSpeed;
                if(this.fadeAlpha > 1) this.fadeAlpha = 1;
            }
        } else if(this.fadeSpeed < 0){ // fade in
            if(this.fadeAlpha <= 0){
                this.fadeSpeed = 0;
            } else {
                this.fadeAlpha += this.fadeSpeed;
                if(this.fadeAlpha < 0) this.fadeAlpha = 0;
            }
        }

        this.infoPanelGems.step();
        this.infoPanelLives.step();
    }

    this.setStaticView = function(){
        context.setTransform(1, 0, 0, 1, 0, 0); // Clear all previous transformation
    }

    this.setIngameView = function(){
        context.setTransform(1, 0, 0, 1, 0, 0); // Clear all previous transformation
        context.translate(-this.x, -this.y);
    }

    this.clear = function(){
        context.fillRect(0, 0, screenWidth, screenHeight);
    }

    /**
        Tells the camera to start fading out.
        When the fading is done, it calls 'f' function and then fades back in.
    */
    this.fadeOut = function(f){
        if(f === undefined) f = null;
        this.fadeOutEvent = f;
        this.fadeSpeed = CAMERA_FADE_SPEED;
        this.fadeAlpha = 0;
    }

    this.fadeIn = function(){
        this.fadeSpeed = -CAMERA_FADE_SPEED;
        this.fadeAlpha = 1;
    }

    this.draw = function(){
        this.setStaticView();

        if(this.fadeAlpha > 0){
            context.fillStyle = "rgba(0, 0, 0, " + this.fadeAlpha.toString() + ")";
            this.clear();
        }

        this.infoPanelGems.drawGemCount();
        this.infoPanelLives.drawLiveCount();
    }
}
