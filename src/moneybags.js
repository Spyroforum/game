
var MONEYBAGS_SPEAK_DISTANCE = 128;

function Moneybags(){
    this.x = 0;
    this.y = 0;
    this.message = "<empty>";
    this.question = "<empty>";
    this.yesOption = "<empty>";
    this.noOption = "<empty>";
    this.yesMessage = "<empty>";
    this.noMessage = "<empty>";
    this.action = null;
    this.sprite = sprMoneybags;
    this.tooltip = false;

    this.init = function(){
        // TODO: handle save data here
    }

    this.step = function(){
        if(objectDistance(this, objSpyro) < MONEYBAGS_SPEAK_DISTANCE){
            this.tooltip = true;
            if(keyboard.isPressed(aKey))
                objLevel.showSpeechBox("Moneybags", "Don't spam unless you are in the SPAM forum. Useless and/or severely off-topic messages are considered spam. These posts will be moved to the forum trash without warning.");
        } else {
            this.tooltip = false;
            objLevel.hideSpeechBox();
        }
    }

    this.draw = function(){
        drawSpriteSimple(context, this.sprite, 1, this.x, this.y);

        if(this.tooltip){
            context.fillStyle = "rgb(255,255,255)";
            drawText(context, "Press (a) to talk.", this.x, this.y - 72, "bold 15px Arial", "center");
        }
    }
}
