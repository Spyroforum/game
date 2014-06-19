window.addEventListener("keydown", keyPress, false);
window.addEventListener("keyup", keyRelease, false);

var keyboard = {keys:0,keycode:[],keystate:[]};


keyboard.addKey = function(keycode){
	keyboard.keycode[keyboard.keys] = keycode;
	keyboard.keystate[keyboard.keys] = 0;
	keyboard.keys++;
	return keyboard.keys-1;
}


keyboard.isPressed = function(key){
    return this.keystate[key] == 1;
}


keyboard.isHeld = function(key){
    return this.keystate[key] > 0;
}


keyboard.isReleased = function(key){
    return this.keystate[key] == -1;
}


keyboard.update = function(){
    for(var n = 0; n < this.keys; n++){
        if(this.keystate[n] == 1) this.keystate[n] = 2;
        else if(this.keystate[n] == -1) this.keystate[n] = 0;
	}
}


function keyPress(e){
    for(var n = 0; n < keyboard.keys; n++){
		if(keyboard.keycode[n] == e.keyCode){
			 if(keyboard.keystate[n] != 2)
			 	keyboard.keystate[n] = 1;
			break;
		}
    }
}


function keyRelease(e){
    for(var n = 0; n < keyboard.keys; n++){
		if(keyboard.keycode[n] == e.keyCode){
			keyboard.keystate[n] = -1;
			break;
		}
    }
}


function ord(str){
	return str.charCodeAt(0);
}
