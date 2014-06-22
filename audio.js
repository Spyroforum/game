/*
	Sound functions that should be used in the game code:
	
		audio.playSound(sound, volume, loop)
				Returns a "sound object", which you can manipulate with the functions below.
				
		"soundObject".stop()
				Stops the sound from playing any further, removing the audio HTML5 element.
				Use it like this:
					"soundObject" = "soundObject".stop();
				
		"soundObject".isPlaying()
				Returns 'true' if the sound is playing or paused, 'false' if it has ended and don't exist any more.
				
		"soundObject".setVolume(volume)
				Sets the volume of the sound. 'volume' should be a value ranging from 0 to 1.
		
		"soundObject".getVolume(volume)
				Returns the volume of the sound, a value ranging from 0 to 1.
				
		"soundObject".setPaused(paused)
				Use to pause or unpause the sound. 'paused' should be a boolean value
				
		"soundObject".isPaused()
				Returns whether or not the sound is paused.
		
		"soundObject".setLoop(loop)
				Specify whether the sound should loop.
		
		"soundObject".isLooping()
				Returns whether the sound is looping.

*/
//A sound object that is returned from audio.playSound(). Can be used to manipulate the sound after it has started to play
var SoundObject = function(element, timeout, index){

	this.element = element;
	this.timeout = timeout;
	this.index = index;

	this.isPlaying = function(){
		return this.element != null;
	}
	
	
	this.stop = function(){
		if( this.timeout != null )
			clearTimeOut(this.timeout);
			
		this.element.pause();
		
		document.body.removeChild( document.getElementById( audio.playedSounds[this.index] ) );
		audio.playedSounds[this.index] = "";
		this.element = null;
		return null;
	}
	
	this.setPaused = function(paused){
		if( paused ){
			if( ! this.element.paused ){
				if( this.timeout != null )
					clearTimeOut(this.timeout);
				this.element.pause();
			}
		} else {
			if( this.element.paused ){
				if( this.timeout == null  && ! this.element.loop )
					this.timeout = setTimeout("audio.destroySound(" + this.index.toString() + ")", (this.element.duration - this.element.currentTime) * 1000 + 1000);
				this.element.play();
			}
		}
	}
	
	this.isPaused = function(){
		return this.element.paused;
	}
	
	this.setVolume = function(volume){
		this.element.volume = volume;
	}
	
	this.getVolume = function(){
		return this.element.volume;
	}
	
	this.setLoop = function(loop){
		if( loop ){
			if( ! this.element.loop ){
				if( this.timeout != null )
					clearTimeOut(this.timeout);
				this.element.loop = true;
			}
		} else {
			if( this.element.loop ){
				this.timeout = setTimeout("audio.destroySound(" + this.index.toString() + ")", (this.element.duration - this.element.currentTime) * 1000 + 1000);
				this.element.loop = false;
			}
		}
	}
	
	this.isLooping = function(){
		return this.element.loop;
	}
}




//Object for managing played sounds
var audio = {
	playedSounds: new Array()
}

audio.playSound = function(sound, volume, loop){
	/*
		sound - the sound to play. Like 'sndGem'
		volume - the volume of the sound, from 0 to 1
		looping - boolean, whether the sound should be looping or not.
		
		returns - a sound object containing the HTML5 audio element, it's destruction timer, and it's index in the list of currently played sounds
			Store it in a variable if you later want to pause the sound, change it's volume, pause or unpause it, or end it while it's still playing
	*/
	
	//Duplicate the audio element of the sound and make it play
	var copy = document.body.appendChild( sound.element.cloneNode() );
	copy.autoplay = true;
	copy.volume = volume;
	copy.loop = loop;
	
	//Find a free index in resources.playingSounds, the list of currently played sounds
	var index = -1;
	var l = audio.playedSounds.length;
	for(var i = 0; i < l; i++){
		if( audio.playedSounds[i] == "" ){
			index = i;
			break;
		}
	}
	//If there wasn't a free index, make the list longer
	if( index == -1 ){
		index = audio.playedSounds.length;
		audio.playedSounds.push("");
	}
	
	//Give the duplicate audio element an id and store this id in the list of currently played sounds
	var id = "playedAudio"+index.toString();
	copy.id = id;	
	audio.playedSounds[index] = id;
	//copy.controls=true;//Make the audio element visible in the document for debugging
	
	
	//Make the audio element remove itself when it has stopped playing
	var t;
	if( loop )
		t = null;
	else t = setTimeout("audio.destroySound(" + index.toString() + ")", sound.element.duration * 1000 + 1000);
	
	//Return an object containing the audio element, it's destruction timer(for when it's stopped playing), and it's index in the list of currently played sounds
	var soundObject = new SoundObject(copy, t, index);
	return soundObject;
}
audio.destroySound = function(index){
	var element = document.getElementById( audio.playedSounds[index] );
	element.pause();
	
	//Remove the audio element with the id stored in audio.playedSounds at index 'index'
	document.body.removeChild( element );
	
	//Free up it's place in the list of currently played sounds
	audio.playedSounds[index] = "";
}