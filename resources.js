//'resources'-object holding all sprites and sounds
var resources = {
	loaded: false,
	numResources: 0,
    sprites: new Array(),
	sounds: new Array(),
}

resources.loadStep = function(){
	var currentlyLoaded = 0;
	
	var l = this.sprites.length;
	for(var i = 0; i < l; i++){
		if( this.sprites[i].img.naturalWidth != 0 )
			currentlyLoaded++;
	}
	
	var l = this.sounds.length;
	for(var i = 0; i<l; i++){
		if( this.sounds[i].element.readyState >=1 )
			currentlyLoaded++;
	}
	
	//Draw loading bar on black background
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.fillStyle = 'rgb(0, 0, 0)';//Black
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	ctx.fillStyle = 'rgb(127, 127, 127)';//Gray unfilled area
	ctx.fillRect(0, screenHeight / 2 - 32, screenWidth, 64);
	ctx.fillStyle = 'rgb(255, 255, 255)';//White filled area
	ctx.fillRect(0, screenHeight / 2 - 32, screenWidth * currentlyLoaded / this.numResources, 64);
	
	if(currentlyLoaded == this.numResources)
		this.loaded = true;
}
	
resources.addSprite = function(source,frames,width,height,originx,originy,sep){
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
		img: new Image(),
		frames: frames,
		width: width,
		height: height,
		originX: originx,
		originY: originy,
		sep: sep
	};
	sprite.img.src = source;
	
	resources.sprites.push(sprite);
	resources.numResources++;

	return sprite;
}

resources.addSound = function(source){
	var element = document.createElement("AUDIO"); 
	
	if( ! element.canPlayType("audio/ogg") )
		source = source.replace(".ogg",".mp3");
		
	var sound = {
		element: element
	};
	element.src = source;
	element.autoplay = false;
	document.body.appendChild(element);
	element.load()
	
	resources.sounds.push(sound);
	resources.numResources++;
	
	return sound;
}