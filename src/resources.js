//'resources'-object holding all sprites and sounds
var resources = {
	loaded: false,
	numResources: 0,
    sprites: [],
	sounds: [],
	textures: [],
	details: []
}

resources.loadStep = function(){
	var currentlyLoaded = 0;
	
	var l = this.sprites.length;
	for(var i = 0; i < l; i++){
		if( this.sprites[i].img.naturalWidth != 0 )
			currentlyLoaded++;
	}
	
	l = this.sounds.length;
	for(var i = 0; i<l; i++){
		if( this.sounds[i].element.readyState >=1 )
			currentlyLoaded++;
	}
	
	l = this.textures.length;
	for(var i = 0; i<l; i++){
		if( this.textures[i].img.naturalWidth != 0 )
			currentlyLoaded++;
	}
	
	l = this.details.length;
	for(var i = 0; i<l; i++){
		if( this.details[i].img.naturalWidth != 0 )
			currentlyLoaded++;
	}
	
	//Draw loading bar on black background
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = 'rgb(0, 0, 0)';//Black
    context.fillRect(0, 0, screenWidth, screenHeight);
    context.fillStyle = 'rgb(127, 127, 127)';//Gray unfilled area
    context.fillRect(0, screenHeight / 2 - 32, screenWidth, 64);
    context.fillStyle = 'rgb(255, 255, 255)';//White filled area
    context.fillRect(0, screenHeight / 2 - 32, screenWidth * currentlyLoaded / this.numResources, 64);
	
	if(currentlyLoaded == this.numResources)
		this.loaded = true;
}
	
/*
**	Loads a sprite from a sprite strip image
**
**	Parameters:
**		<source> - the image file name
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
resources.addSprite = function(source,frames,width,height,originx,originy,sep){
	var sprite = {
		img: new Image(),
		frames: frames,
		width: width,
		height: height,
		originX: originx,
		originY: originy,
		sep: sep
	};
    sprite.img.src = "../resources/graphics/sprites/" + source;
	
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
    element.src = "../resources/sounds/" + source;
	element.autoplay = false;
	document.body.appendChild(element);
	element.load()
	
	resources.sounds.push(sound);
	resources.numResources++;
	
	return sound;
}

resources.addTexture = function(source){
	var texture = {
		img: new Image()
	};
    texture.img.src = "../resources/graphics/textures/" + source;
	
	resources.textures.push(texture);
	resources.numResources++;

	return texture;
}

resources.addDetail = function(source,originx,originy){
	var detail = {
		img: new Image(),
		originX: originx,
		originY: originy
	};
    detail.img.src = "../resources/graphics/details/" + source;
	
	resources.details.push(detail);
	resources.numResources++;

	return detail;
}

resources.getFromString = function(str){
	var type = str.substring(0,3);
	var list = null;
	if( type == "snd"){
		list = this.sounds;
		var l = list.length;
		for( var n = 0; n < l; n++){
			if( list[n].element.src.indexOf(str,0) != -1 )
				return list[n];
		}
	} else {
		if( type == "spr")
			list = this.sprites;
		else if( type == "tex")
			list = this.textures;
		else if( type == "dtl")
			list = this.details;
			
		if( list != null ){
			var l = list.length;
			for( var n = 0; n < l; n++){
				if( list[n].img.src.indexOf(str,0) != -1 )
					return list[n];
			}
		}
	}
	return null;
}
