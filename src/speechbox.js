
var SPEECH_BOX_HEIGHT = 128;
var SPEECH_BOX_MARGIN = 24;
var SPEECH_BOX_CORNER_SIZE = 16;
var SPEECH_BOX_MOVE_SPEED = 64;
var SPEECH_BOX_BORDER_SPEED = 2;
var SPEECH_BOX_ROW_SIZE = 61; // max number of characters per line
var SPEECH_BOX_PADDING = 16;
var SPEECH_BOX_FONT_SIZE = 15;
var SPEECH_BOX_BORDER = 32;
var SPEECH_BOX_MESSAGE_SPEED = 1;

var SPEECH_BOX_CONTENT_HEIGHT = SPEECH_BOX_HEIGHT - 2*SPEECH_BOX_PADDING - SPEECH_BOX_FONT_SIZE;
var SPEECH_BOX_VISIBLE_ROW_COUNT = Math.floor(SPEECH_BOX_CONTENT_HEIGHT / SPEECH_BOX_FONT_SIZE);

function SpeechBox(){
    this.dialog = null;
    this.x = -screenWidth;
    this.border = 0;
    this.raise = false;
    this.cursor = 0;
    this.scroll = 0;

    this.show = function(dialog){
        this.dialog = dialog;
        this.dialog.reset();
        this.raise = true;
        this.cursor = 0;
        this.scroll = 0;
    }

    this.hide = function(){
        this.raise = false;
    }

    this.nextPage = function(){
        this.dialog.nextPage();
        this.cursor = 0;
        this.scroll = 0;
    }

    this.step = function(){
        if(this.raise){ // if the box is to be shown
            if(!this.moveBoxRight()){ // if the box is fully displayed
                if(!this.nextCharacters(SPEECH_BOX_MESSAGE_SPEED)){ // if all text is displayed
                    if(keyboard.isPressed(aKey)){
                        if(this.dialog.hasMorePages())
                            this.nextPage();
                        else
                            this.hide();
                    } else if(keyboard.isPressed(upKey)){
                        this.scrollUp();
                    } else if(keyboard.isPressed(downKey)){
                        this.scrollDown();
                    }
                } else { // if some text is still hidden
                    if(keyboard.isPressed(aKey)){
                        // show all text if player don't want to wait
                        this.nextCharacters(this.dialog.currentPage().message.length);
                    }
                }
            }
        } else this.moveBoxLeft(); // if the box is to be hidden
    }


    /**
        Moves box and border to the right until its fully visible.

        Returns:
            true if the box can still move (not affected by border)
            false if the box is fully visible
    */
    this.moveBoxRight = function(){
        this.x += SPEECH_BOX_MOVE_SPEED;
        this.border += SPEECH_BOX_BORDER_SPEED;
        if(this.border > SPEECH_BOX_BORDER) this.border = SPEECH_BOX_BORDER;
        if(this.x >= 0){
            this.x = 0;
            return false;
        } else return true;
    }


    /**
        Moves box and border to the left until its fully hidden.
    */
    this.moveBoxLeft = function(){
        this.x -= SPEECH_BOX_MOVE_SPEED;
        this.border -= SPEECH_BOX_BORDER_SPEED;
        if(this.x < -screenWidth) this.x = -screenWidth;
        if(this.border < 0) this.border = 0;
    }


    /**
        Shows next characters in the box, depending on message speed.
        It also scrolls down automatically if the message is too long.

        Parameters:
            speed (int) - the number of next characters to be shown

        Returns:
            true if there are still characters left to be displayed
            false if all text is fully displayed
    */
    this.nextCharacters = function(speed){
        var mlength = this.dialog.currentPage().message.length;
        var rval = true;
        var oldCursor = this.cursor;
        this.cursor += speed;
        if(this.cursor >= mlength){
            this.cursor = mlength-1;
            rval = false;
        }

        if(oldCursor != this.cursor)
            this.scrollDown(); // auto scrolls down if needed

        return rval;
    }


    /**
        Scrolls up in dialog by one line if possible.
    */
    this.scrollUp = function(){
        this.scroll--;
        if(this.scroll < 0) this.scroll = 0;
    }


    /**
        Scrolls down in dialog by one line if possible.
    */
    this.scrollDown = function(){
        var maxScroll = Math.floor(this.cursor / SPEECH_BOX_ROW_SIZE) - SPEECH_BOX_VISIBLE_ROW_COUNT + 1;
        if(maxScroll > 0){
            this.scroll++;
            if(this.scroll > maxScroll)
                this.scroll = maxScroll;
        }
    }


    // returns true if any part of the speech box is visible
    this.isVisible = function(){
        return (this.x > -screenWidth) || (this.border > 0);
    }


    this.draw = function(){
        if(!this.isVisible()) return;

        objCamera.setStaticView();

        // draw borders
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, screenWidth, this.border);
        context.fillRect(0, screenHeight - this.border, screenWidth, this.border);

        // draw text area
        context.fillStyle = "rgba(0,0,0,0.75)";
        var y = screenHeight - SPEECH_BOX_HEIGHT - SPEECH_BOX_MARGIN - SPEECH_BOX_BORDER;
        var x = this.x + SPEECH_BOX_MARGIN;
        drawRectangleRounded(context, x, y, screenWidth - 2*SPEECH_BOX_MARGIN, SPEECH_BOX_HEIGHT,
                             SPEECH_BOX_CORNER_SIZE);

        if(this.dialog == null) return;

        // draw title
        x += SPEECH_BOX_PADDING;
        y += SPEECH_BOX_FONT_SIZE + SPEECH_BOX_PADDING;
        context.fillStyle = "rgb(255,255,255)";
        drawText(context, this.dialog.currentPage().title, x, y, "bold " + SPEECH_BOX_FONT_SIZE + "px Courier", "left");

        context.save();
        context.rect(0, y, screenWidth, SPEECH_BOX_CONTENT_HEIGHT);
        context.clip();

        // draw message
        var message = this.dialog.currentPage().message;
        var start = 0;
        var end = SPEECH_BOX_ROW_SIZE - 1;
        var length = Math.min(message.length, this.cursor);
        y -= this.scroll * SPEECH_BOX_FONT_SIZE;

        while(true){
            y += SPEECH_BOX_FONT_SIZE;

            if(start >= length) break;
            if(end >= length){
                end = length - 1;
                if(end < start) break;
            }

            drawText(context, message.substring(start, end+1), x, y,
                     "bold " + SPEECH_BOX_FONT_SIZE + "px Courier", "left");

            start += SPEECH_BOX_ROW_SIZE;
            end += SPEECH_BOX_ROW_SIZE;
        }

        context.restore();
    }
}
