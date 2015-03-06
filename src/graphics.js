
/*
**    draws a single frame of a sprite
**
**    Parameters:
**      <context> - the context of the canvas to draw on
**        <spr> - the sprite to draw a frame of
**        <frame> - the frame to draw
**        <x> - the x coordinate of the drawn sprite
**        <y> - the y coordinate of the drawn sprite
**        <xscale> - the x axis scale of the drawn sprite(before rotation)
**        <yscale> - the y axis scale of the drawn sprite(before rotation)
**        <angle> - the rotation angle of the drawn sprite
**
**    Returns:
**        Nothing
*/
function drawSprite(context,spr,frame,x,y,xscale,yscale,angle){
    context.translate(x, y);
    context.rotate( -angle * Math.PI / 180);
    context.scale(xscale, yscale);
    context.drawImage(spr.img, (Math.round(frame) % spr.frames) * spr.width, 0, spr.width, spr.height, -spr.originX, -spr.originY, spr.width, spr.height);
    context.scale(1 / xscale, 1 / yscale);
    context.rotate( angle * Math.PI / 180);
    context.translate( -x, -y);
}

/*
    Simplified version of function above.
*/
function drawSpriteSimple(context, spr, frame, x, y){
    context.translate(x, y);
    context.drawImage(spr.img, (Math.round(frame) % spr.frames) * spr.width, 0, spr.width, spr.height, -spr.originX, -spr.originY, spr.width, spr.height);
    context.translate( -x, -y);
}

/**
    Draws text at given position.

    Parameters:
        text (string) - text to be drawn
        x, y (int) - position
        font (string) - example: "15px Arial"
        align (string) - eiter "left", "center" or "right"

*/
function drawText(context, text, x, y, font, align){
    context.font = font;
    context.textAlign = align;
    context.fillText(text, x, y);
}


/**
    Draws rectangle with rounded corners.

    Parameters:
        x, y (int) - position of top left corner
        width, height (int) - including corners
        cornerRadius (int)
*/
function drawRectangleRounded(context, x, y, width, height, cornerRadius){
    var x1 = x + cornerRadius;
    var y1 = y + cornerRadius;
    var x2 = x + width - cornerRadius;
    var y2 = y + height - cornerRadius;

    context.fillRect(x1, y, width - 2*cornerRadius, height); // middle + top + bottom
    context.fillRect(x, y1, cornerRadius, height - 2*cornerRadius); // left
    context.fillRect(x2, y1, cornerRadius, height - 2*cornerRadius); // right

    drawPie(context, x2, y1, 0, 90, cornerRadius); // right top
    drawPie(context, x1, y1, 90, 180, cornerRadius); // left top
    drawPie(context, x1, y2, 180, 270, cornerRadius); // left bottom
    drawPie(context, x2, y2, 270, 360, cornerRadius); // right bottom
}


/**
    Draws "pie" (part of circle) at given position.

    Parameters:
        x, y (number) - position of the center
        a1, a2 (number) - starting, ending angle in degrees (counter clockwise, 0° on 3 hours)
        r (number) - radius
*/
function drawPie(context, x, y, a1, a2, r){
    // clockwise to counter clockwise conversion
    a1 = 360 - a1;
    a2 = 360 - a2;

    context.beginPath();
    context.arc(x, y, r, a2*Math.PI / 180, a1*Math.PI / 180, false);
    context.lineTo(x, y);
    context.fill();
}

var ANIMATION_LOOP_R = 0; // moves to last frame and then JUMPS back to first frame
var ANIMATION_LOOP_RL = 1; // moves to last frame and then MOVES back to the first frame

/*
    Parameters:
        sprite - reference returned by resources.addSprite function
        type (int) - eiter ANIMATION_LOOP_R or ANIMATION_LOOP_RL
*/
function Animation(sprite, type){
    this.sprite = sprite;
    this.frame = 0;
	this.animSpeed = 1;
	this.decimalFrame = 0;

    this.draw = function(x, y){
        drawSpriteSimple(context, this.sprite, this.frame, x, y);
    }

    this.drawExt = function(x, y, xscale, yscale, angle){
        drawSprite(context, this.sprite, this.frame, x, y, xscale, yscale, angle);
    }

    this.frameCount = function(){
        return this.sprite.frames;
    }
	
	this.randomFrame = function(){
		this.decimalFrame = (Math.random()*this.frameCount()) % this.frameCount();
		this.frame = Math.round(this.decimalFrame);
		
	}
	
	this.goToFrame = function(frame){
		this.decimalFrame = (frame + this.frameCount()) % this.frameCount();
		this.frame = Math.round(this.decimalFrame);
	}

    // nextFrame function depends on animation type
    if(typeof type === 'undefined'){}
    else if(type == ANIMATION_LOOP_R){
        /*
            increases current frame by 1
            if there are no more frames, then current frame is set to 0
        */
        this.nextFrame = function(){
			this.decimalFrame = (this.decimalFrame + this.animSpeed + this.frameCount()) % this.frameCount();
            this.frame = Math.round(this.decimalFrame);
        }
    } else if(type == ANIMATION_LOOP_RL){
        this.dir = 1;
        this.nextFrame = function(){
            this.decimalFrame += this.dir * this.animSpeed;
            // if no more frames to the left or right
            if(this.decimalFrame <= 0 || this.decimalFrame >= this.frameCount()-1)
                this.dir *= -1;
			this.frame = Math.round(this.decimalFrame);
        }
    }
}
