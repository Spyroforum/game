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
	context.translate(x, y);
	context.rotate(angle * Math.PI / 180);
	context.scale(xscale, yscale);
	context.drawImage(spr.img, (Math.round(frame) % spr.frames) * spr.width, 0, spr.width, spr.height, -spr.originX, -spr.originY, spr.width, spr.height);
	context.scale(1 / xscale, 1 / yscale);
	context.rotate( -angle * Math.PI / 180);
	context.translate( -x, -y);
}