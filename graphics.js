function drawSprite(context,spr,frame,x,y,xscale,yscale,angle){
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
	context.translate(x,y);
	context.rotate(angle*Math.PI/180);
	context.scale(xscale,yscale);
	context.drawImage(spr.img,(Math.round(frame) % spr.frames)*spr.width,0,spr.width,spr.height,-spr.originX,-spr.originY,spr.width,spr.height);
	context.scale(1/xscale,1/yscale);
	context.rotate(-angle*Math.PI/180);
	context.translate(-x,-y);
	//context.setTransform(1,0,0,1,0,0);
}
function loadSprite(source,frames,width,height,originx,originy,sep){
	/*
	**	Loads a sprite from a sprite strip image
	**
	**	Parameters:
	**		<source> - the image url to load from
	**		<frames> - the number of frames in the animation
	**		<width> - the width of a single sprite frame of the strip
	**		<height> - the height of the sprite
	**		<originx> - the x origin of the sprite
	**		<originy> - the y origin of the sprite
	**		<sep> - the number of pixels separating each frame of the sprite strip
	**
	**	Returns:
	**		the sprite
	*/
	var sprite = {
		img:new Image(),
		frames:frames,
		width:width,
		height:height,
		originX:originx,
		originY:originy,
		sep:sep
	};
	sprite.img.par = sprite;
	sprite.img.src = source;

	return sprite;
}