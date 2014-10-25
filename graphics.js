/*
**	draws a single frame of a sprite
**
**	Parameters:
**		<context> - the context of the canvas to draw on
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


var ANIMATION_LOOP_JUMP = 0; // moves to last frame and then JUMPS back to first frame
var ANIMATION_LOOP_MOVE = 1; // moves to last frame and then MOVES back to the first frame

/*
    Parameters:
        sprite - reference returned by resources.addSprite function
        type (int) - eiter ANIMATION_LOOP or ANIMATION_LOOPBACK
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
    else if(type == ANIMATION_LOOP_JUMP){
        /*
            increases current frame by 1
            if there are no more frames, then current frame is set to 0
        */
        this.nextFrame = function(){
            this.frame++;
            if(this.frame >= this.frameCount())
                this.frame = 0;
        }
    } else if(type == ANIMATION_LOOP_MOVE){
        this.dir = 1;
        this.nextFrame = function(){
            this.frame += this.dir;
            // if no more frames to the left or right
            if(this.frame <= 0 || this.frame >= this.frameCount()-1)
                this.dir *= -1;
        }
    }
}
