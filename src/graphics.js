
/*
**	draws a single frame of a sprite
**
**	Parameters:
**		<spr> - the sprite to draw a frame of
**		<frame> - the frame to draw
**		<x> - the x coordinate of the drawn sprite
**		<y> - the y coordinate of the drawn sprite
**		<xscale> - the x axis scale of the drawn sprite(before rotation)
**		<yscale> - the y axis scale of the drawn sprite(before rotation)
**		<angle> - the rotation angle of the drawn sprite
**
**	Returns:
**		Nothing
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

var ANIMATION_LOOP_R = 0; // moves to last frame and then JUMPS back to first frame
var ANIMATION_LOOP_RL = 1; // moves to last frame and then MOVES back to the first frame

/*
    Parameters:
        sprite - reference returned by resources.addSprite function
        type (int) - eiter ANIMATION_LOOP_R or ANIMATION_LOOP_RL
*/
function Animation(sprite, type){
    this.sprite = sprite;
    this.frame = 0

    this.draw = function(x, y){
        drawSpriteSimple(context, this.sprite, this.frame, x, y);
    }

    this.drawExt = function(x, y, xscale, yscale, angle){
        drawSprite(context, this.sprite, this.frame, x, y, xscale, yscale, angle);
    }

    this.frameCount = function(){
        return this.sprite.frames;
    }

    // nextFrame function depends on animation type
    if(typeof type === 'undefined'){}
    else if(type == ANIMATION_LOOP_R){
        /*
            increases current frame by 1
            if there are no more frames, then current frame is set to 0
        */
        this.nextFrame = function(){
            this.frame++;
            if(this.frame >= this.frameCount())
                this.frame = 0;
        }
    } else if(type == ANIMATION_LOOP_RL){
        this.dir = 1;
        this.nextFrame = function(){
            this.frame += this.dir;
            // if no more frames to the left or right
            if(this.frame <= 0 || this.frame >= this.frameCount()-1)
                this.dir *= -1;
        }
    }
}
