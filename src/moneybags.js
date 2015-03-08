
var MONEYBAGS_SPEAK_DISTANCE = 128;

function Moneybags(){
    this.x = 0;
    this.y = 0;
    this.dialog = null;
    this.sprite = sprMoneybags;
    this.tooltip = false;

    this.init = function(){
        // TODO: handle save data here
        this.dialog = new Dialog([
			new DialogPage("Moneybags", "Don't spam unless you are in the SPAM forum. Useless and/or severely off-topic messages are considered spam. These posts will be moved to the forum trash without warning. ......................................................................... This has been a long time coming, I think. I've decided that our new policy is going to be allow videos and links with reasonable amounts* of ..."),
            new DialogPage("Moneybags", "When you get a TNT crate on your head, start hopping immediately. If you react fast, and hop enough times, the TNT crate will fall of your head before it explodes."),
            new DialogPage("Moneybags", "Choose a option: ", [
               new DialogOption("test 1", new DialogPage("Moneybags", "I see you choosed option 1.")),
               new DialogOption("test 2", new DialogPage("Moneybags", "I see you choosed option 2.")),
               new DialogOption("test 3", new DialogPage("Moneybags", "I see you choosed option 3."))
           ])
        ], null);
    }

    this.step = function(){
        this.tooltip = objectDistance(this, objSpyro) < MONEYBAGS_SPEAK_DISTANCE && !objLevel.isDialogVisible();
        if(this.tooltip && keyboard.isPressed(wKey)){
            objLevel.showDialog(this.dialog);
        }
    }

    this.draw = function(){
        drawSpriteSimple(context, this.sprite, 1, this.x, this.y);

        if(this.tooltip){
            context.fillStyle = "rgb(255,255,255)";
            drawText(context, "Press (w) to talk.", this.x, this.y - 72, "bold 15px Arial", "center");
        }
    }
}
