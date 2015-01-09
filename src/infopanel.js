
var INFO_PANEL_SIZE = 64;
var INFO_PANEL_DURATION = 100; // steps
var INFO_PANEL_SPEED = 3;

function InfoPanel(){
    this.y = -INFO_PANEL_SIZE;
    this.timer = new Timer(INFO_PANEL_DURATION);
    this.raise = false;

    /**
        Shows the panel for INFO_PANEL_DURATION steps.
        (after the period the panel is hidden automatically)
    */
    this.show = function(){
        this.raise = true;
        this.timer.reset(INFO_PANEL_DURATION);
    }

    this.hide = function(){
        this.raise = false;
    }

    this.step = function(){
        // raise or lower the panel
        if(this.raise === true){
            this.y += INFO_PANEL_SPEED;
            if(this.y > 0) this.y = 0;
            if(this.timer.tick()) this.hide();
        } else {
            this.y -= INFO_PANEL_SPEED;
            if(this.y < -INFO_PANEL_SIZE) this.y = -INFO_PANEL_SIZE;
        }
    }

    this.drawGemCount = function(){
        if(objLevel == null || this.y <= -INFO_PANEL_SIZE) return;

        context.fillStyle = "rgb(255,255,255)";
        drawText(context, saveData.getLevelGemCount(objLevel.id), 52, 42 + this.y, "bold 24px Arial", "left");
        drawSpriteSimple(context, sprGemGreen, 0, 32, 32 + this.y);
    }

    this.drawLiveCount = function(){
        if(objLevel == null || this.y <= -INFO_PANEL_SIZE) return;

        context.fillStyle = "rgb(255,255,255)";
        drawText(context, saveData.lives, screenWidth/2, 42 + this.y, "bold 24px Arial", "left");
        // TODO - draw live icon
    }
}
