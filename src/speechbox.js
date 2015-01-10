
var SPEECH_BOX_HEIGHT = 128;
var SPEECH_BOX_MARGIN = 24;
var SPEECH_BOX_CORNER_SIZE = 16;

function SpeechBox(){
    this.title = null;
    this.message = null;
    this.x = -screenWidth;

    this.show = function(/*title, message*/){

    }

    this.hide = function(){

    }

    this.step = function(){

    }

    this.draw = function(){
        objCamera.setStaticView();
        context.fillStyle = "rgba(0,0,0,0.75)";
        drawRectangleRounded(context,
                             this.x + SPEECH_BOX_MARGIN,
                             screenHeight - SPEECH_BOX_HEIGHT - SPEECH_BOX_MARGIN,
                             screenWidth - 2*SPEECH_BOX_MARGIN,
                             SPEECH_BOX_HEIGHT,
                             SPEECH_BOX_CORNER_SIZE);
    }
}
