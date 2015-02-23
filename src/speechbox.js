
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
    this.cursor = 0;
    this.scroll = 0;
    this.currentPage = null;
    this.currentPageId = 0;
    this.currentOptionId = 0;


    /**
        Shows speech box, displaying given dialog.
        Does nothing if passed null or undefined.
        Player won't be able to control Spyro until the dialog is closed.
    */
    this.show = function(dialog){
        if(dialog === null || dialog === undefined) return;

        this.dialog = dialog;
        this.currentPageId = 0;
        this.currentPage = this.dialog.pages[this.currentPageId];

        this.cursor = 0;
        this.scroll = 0;
        this.currentOptionId = 0;

        this.step = this.stepRaise;
    }


    /**
        Hides speech box and calls Dialog.closeAction function (if not null)
    */
    this.close = function(){
        this.step = this.stepHide;

        if(this.dialog != null)
            if(this.dialog.closeAction != null)
                this.dialog.closeAction.apply();
    }


    this.nextPage = function(){
        if(this.hasMorePages()){
            this.currentPageId++;
            this.setPage(this.dialog.pages[this.currentPageId]);
        } else {
            this.close();
        }
    }


    this.setPage = function(page){
        this.currentPage = page;

        this.cursor = 0;
        this.scroll = 0;
        this.currentOptionId = 0;

        this.step = this.stepRead;
    }


    this.currentOption = function(){
        return this.currentPage.options[this.currentOptionId];
    }


    this.hasMorePages = function(){
        return (this.currentPageId + 1) < this.dialog.pages.length;
    }


    this.hasOptions = function(){
        return this.currentPage.options.length > 0;
    }


    this.stepBlank = function(){}

    this.step = this.stepBlank;


    this.stepRaise = function(){
        this.border += SPEECH_BOX_BORDER_SPEED;
        if(this.border > SPEECH_BOX_BORDER) this.border = SPEECH_BOX_BORDER;

        this.x += SPEECH_BOX_MOVE_SPEED;
        if(this.x >= 0){
            this.x = 0;
            if(this.border == SPEECH_BOX_BORDER)
                this.step = this.stepRead;
        }
    }


    this.stepHide = function(){
        this.border -= SPEECH_BOX_BORDER_SPEED;
        if(this.border < 0) this.border = 0;

        this.x -= SPEECH_BOX_MOVE_SPEED;
        if(this.x < -screenWidth){
            this.x = -screenWidth;
            if(this.border == 0)
                this.step = this.stepBlank;
        }
    }


    this.stepRead = function(){
        var mlength = this.currentPage.message.length;
        this.cursor += SPEECH_BOX_MESSAGE_SPEED; // show next characters
        if(this.cursor >= mlength || keyboard.isPressed(aKey)){ // if we reached the end or player don't want to wait
            this.cursor = mlength;
            this.step = this.stepWait;
        }

        while(this.scrollDown()){} // scroll to the bottom
    }


    this.stepWait = function(){
        if(keyboard.isPressed(aKey)){
            if(!this.hasOptions()){
                this.nextPage();
            } else {
                var cop = this.currentOption();
                if(cop.action !== null)
                    this.dialog.closeAction = cop.action;
                if(cop.nextPage !== null)
                    this.setPage(cop.nextPage);
                else
                    this.nextPage();
            }
        } else if(keyboard.isPressed(upKey)){
            this.optionUp();
            this.scrollUp();
        } else if(keyboard.isPressed(downKey)){
            this.optionDown();
            this.scrollDown();
        }
    }


    /**
        Scrolls up in dialog by one line if possible.
        Returns true if scrolled, false otherwise.
    */
    this.scrollUp = function(){
        if(this.scroll <= 0) return false;
        else {
            this.scroll--;
            return true;
        }
    }


    /**
        Scrolls down in dialog by one line if possible.
        Returns true if scrolled, false otherwise.
    */
    this.scrollDown = function(){
		var maxScroll = -SPEECH_BOX_VISIBLE_ROW_COUNT;
		var start = 0;
		var end;
		var message = this.currentPage.message;
		var length = message.length;
		while( start <= this.cursor ){
			if( start + SPEECH_BOX_ROW_SIZE >= length || message.indexOf(" ", start) >= start + SPEECH_BOX_ROW_SIZE )
				end += SPEECH_BOX_ROW_SIZE;
			else 
				end = message.lastIndexOf(" ", start + SPEECH_BOX_ROW_SIZE);
			start = end + 1;
			maxScroll ++;
		}
        if(this.cursor == this.currentPage.message.length && this.currentPage.options.length > 0) maxScroll += this.currentPage.options.length-1;

        if(this.scroll >= maxScroll) return false;
        else {
            this.scroll++;
            return true;
        }
    }


    /**
        Moves option up if possible.
        Returns true if moved, false otherwise.
    */
    this.optionUp = function(){
        if(this.currentOptionId <= 0){
            return false;
        } else {
            this.currentOptionId--;
            return true;
        }
    }


    /**
        Moves option down if possible.
        Returns true if moved, false otherwise.
    */
    this.optionDown = function(){
        if(this.currentOptionId + 1 >= this.currentPage.options.length){
            return false;
        } else {
            this.currentOptionId++;
            return true;
        }
    }


    // returns true if any part of the speech box is visible
    this.isVisible = function(){
        return (this.x > -screenWidth) || (this.border > 0);
    }


    this.isActive = function(){
        return (this.step !== this.stepBlank) && (this.step !== this.stepHide);
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

        if(this.dialog === null) return;

        // draw title
        x += SPEECH_BOX_PADDING;
        y += SPEECH_BOX_FONT_SIZE + SPEECH_BOX_PADDING;
        context.fillStyle = "rgb(255,255,255)";
        this.drawText(this.currentPage.title, x, y);

        context.save();
        context.rect(0, y, screenWidth, SPEECH_BOX_CONTENT_HEIGHT);
        context.clip();

        // draw message
        var message = this.currentPage.message;
        var start = 0;
        var end = 0;
        var length = message.length;
        y -= this.scroll * SPEECH_BOX_FONT_SIZE;
        while( start <= this.cursor ){
			y += SPEECH_BOX_FONT_SIZE;
			// If the current line covers the rest of the message, or if there is no " " (space) in the reach of the current line,
			if( start + SPEECH_BOX_ROW_SIZE >= length || message.indexOf(" ", start) >= start + SPEECH_BOX_ROW_SIZE )
				end += SPEECH_BOX_ROW_SIZE; // display as much of the message as possible on the current line.
			else // Otherwise
				end = message.lastIndexOf(" ", start + SPEECH_BOX_ROW_SIZE); // stop after the last complete word.
			this.drawText(message.substring(start, Math.min(end + 1, this.cursor)), x, y);
			start = end + 1;
        }

        // draw options
        if(this.hasOptions() && this.cursor >= message.length){
            for(var i = 0; i < this.currentPage.options.length; i++){
			    y += SPEECH_BOX_FONT_SIZE;
                if(i == this.currentOptionId)
                    context.fillStyle = "rgb(255,255,255)";
                else
                    context.fillStyle = "rgb(127,127,127)";
                this.drawText("* " + this.currentPage.options[i].label, x, y);
            }
        }

        context.restore();
    }

    this.drawText = function(message, x, y){
        drawText(context, message, x, y, "bold " + SPEECH_BOX_FONT_SIZE + "px Courier", "left");
    }
}
