window.addEventListener("keydown", keyPressEvent, false);
window.addEventListener("keyup", keyReleaseEvent, false);

var KEYBOARD_KEY_PRESSED = 1;
var KEYBOARD_KEY_RELEASED = -1;
var KEYBOARD_KEY_HELD = 2;
var KEYBOARD_KEY_NOT_HELD = 0;

var keyboard = {keys:0,keycode:[],keystate:[]};


keyboard.addKey = function(keycode){
	keyboard.keycode[keyboard.keys] = keycode;
	keyboard.keystate[keyboard.keys] = KEYBOARD_KEY_NOT_HELD;
	keyboard.keys++;
	return keyboard.keys-1;
}


keyboard.isPressed = function(key){
    return this.keystate[key] === KEYBOARD_KEY_PRESSED;
}


keyboard.isHeld = function(key){
    return this.keystate[key] === KEYBOARD_KEY_PRESSED ||
            this.keystate[key] === KEYBOARD_KEY_HELD;
}


keyboard.isReleased = function(key){
    return this.keystate[key] == KEYBOARD_KEY_RELEASED;
}


keyboard.update = function(){
    for(var n = 0; n < this.keys; n++){
        if( this.keystate[n] === KEYBOARD_KEY_PRESSED )
			this.keystate[n] = KEYBOARD_KEY_HELD;
        else if( this.keystate[n] === KEYBOARD_KEY_RELEASED )
			this.keystate[n] = KEYBOARD_KEY_NOT_HELD;
	}
}


function keyPressEvent(e){
    for(var n = 0; n < keyboard.keys; n++){
		if( keyboard.keycode[n] === e.keyCode ){
			 if( keyboard.keystate[n] !== KEYBOARD_KEY_HELD )
			 	keyboard.keystate[n] = KEYBOARD_KEY_PRESSED;
			break;
		}
    }
}


function keyReleaseEvent(e){
    for(var n = 0; n < keyboard.keys; n++){
		if( keyboard.keycode[n] === e.keyCode ){
			keyboard.keystate[n] = KEYBOARD_KEY_RELEASED;
			break;
		}
    }
}


function ord(str){
	return str.charCodeAt(0);
}
