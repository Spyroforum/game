
var SPEECH_BOX_HEIGHT = 128;
var SPEECH_BOX_MARGIN = 24;
var SPEECH_BOX_CORNER_SIZE = 16;
var SPEECH_BOX_MOVE_SPEED = 40;
var SPEECH_BOX_BORDER_SPEED = 2;
var SPEECH_BOX_ROW_SIZE = 61; // max number of characters per line
var SPEECH_BOX_PADDING = 16;
var SPEECH_BOX_FONT_SIZE = 15;
var SPEECH_BOX_BORDER = 32;
var SPEECH_BOX_MESSAGE_SPEED = 1;

function SpeechBox(){
    this.title = "";
    this.message = "";
    this.x = -screenWidth;
    this.border = 0;
    this.raise = false;
    this.cursor = 0;

    this.show = function(title, message){
        this.raise = true;
        this.nextMessage(title, message);
    }

    this.hide = function(){
        this.raise = false;
    }

    this.nextMessage = function(title, message){
        this.title = title;
        this.message = message;
        this.cursor = 0;
    }

    this.setMessage = function(title, message){
        this.title = title;
        this.message = message;
        this.cursor = 9999;
    }

    this.step = function(){
        if(this.raise){
            this.x += SPEECH_BOX_MOVE_SPEED;
            this.border += SPEECH_BOX_BORDER_SPEED;
            if(this.border > SPEECH_BOX_BORDER) this.border = SPEECH_BOX_BORDER;
            if(this.x >= 0){
                this.x = 0;
                this.cursor += SPEECH_BOX_MESSAGE_SPEED;
                if(this.cursor > 9999) this.cursor = 9999;
            }

        } else {
            this.x -= SPEECH_BOX_MOVE_SPEED;
            this.border -= SPEECH_BOX_BORDER_SPEED;
            if(this.x < -screenWidth) this.x = -screenWidth;
            if(this.border < 0) this.border = 0;
        }
    }

    this.draw = function(){
        objCamera.setStaticView();

        // draw rectangle
        context.fillStyle = "rgba(0,0,0,0.75)";
        var y = screenHeight - SPEECH_BOX_HEIGHT - SPEECH_BOX_MARGIN - SPEECH_BOX_BORDER;
        var x = this.x + SPEECH_BOX_MARGIN;
        drawRectangleRounded(context, x, y, screenWidth - 2*SPEECH_BOX_MARGIN, SPEECH_BOX_HEIGHT,
                             SPEECH_BOX_CORNER_SIZE);

        // draw black borders
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, screenWidth, this.border);
        context.fillRect(0, screenHeight - this.border, screenWidth, this.border);

        // draw title
        x += SPEECH_BOX_PADDING;
        y += SPEECH_BOX_FONT_SIZE + SPEECH_BOX_PADDING;
        context.fillStyle = "rgb(255,255,255)";
        drawText(context, this.title, x, y, "bold " + SPEECH_BOX_FONT_SIZE + "px Courier", "left");

        // draw message
        var start = 0;
        var end = SPEECH_BOX_ROW_SIZE - 1;
        var length = Math.min(this.message.length, this.cursor);

        while(true){
            y += SPEECH_BOX_FONT_SIZE;

            if(start >= length) break;
            if(end >= length){
                end = length - 1;
                if(end < start) break;
            }

            drawText(context, this.message.substring(start, end+1), x, y,
                     "bold " + SPEECH_BOX_FONT_SIZE + "px Courier", "left");

            start += SPEECH_BOX_ROW_SIZE;
            end += SPEECH_BOX_ROW_SIZE;
        }
    }
}
