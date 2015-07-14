
window.addEventListener("keydown", keyPressEvent, false);
window.addEventListener("keyup", keyReleaseEvent, false);

function ord(str){
	return str.charCodeAt(0);
}

var KEYBOARD_KEY_PRESSED = 1;
var KEYBOARD_KEY_RELEASED = -1;
var KEYBOARD_KEY_HELD = 2;
var KEYBOARD_KEY_NOT_HELD = 0;

var KEYBOARD_DEFAULT_CHARGE_CODE = ord("A");
var KEYBOARD_DEFAULT_FLAME_CODE = ord("D");
var KEYBOARD_DEFAULT_JUMP_CODE = ord("S");
var KEYBOARD_DEFAULT_TALK_CODE = ord("W");
var KEYBOARD_DEFAULT_MOVE_LEFT_CODE = 37; // left arrow
var KEYBOARD_DEFAULT_MOVE_RIGHT_CODE = 39; // right arrow
var KEYBOARD_DEFAULT_MOVE_UP_CODE = 38; // right arrow
var KEYBOARD_DEFAULT_MOVE_DOWN_CODE = 40; // right arrow

function keyPressEvent(e){
    for(var n = 0; n < keyboard.keys; n++){
		if( keyboard.keycode[n] === e.keyCode ){
			 if( keyboard.keystate[n] !== KEYBOARD_KEY_HELD )
			 	keyboard.keystate[n] = KEYBOARD_KEY_PRESSED;
			break;
		}
    }

    if(typeof controls !== "undefined"){
        for(var i = 0; i < BUTTON_COUNT; i++){
            if(e.keyCode === keyboard._buttonCodes[i]){
                controls.pressEvent(i);
            }
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

    if(typeof controls !== "undefined"){
        for(var i = 0; i < BUTTON_COUNT; i++){
            if(e.keyCode === keyboard._buttonCodes[i]){
                controls.releaseEvent(i);
            }
        }
    }
}


function Keyboard(){
    this.keys = 0;
    this.keycode = [];
    this.keystate = [];
    this._buttonCodes = new Array(BUTTON_COUNT);

    this.setButtonCode = function(button, code){
        this._buttonCodes[button] = code;
    }

    this.resetButtonCodes = function(){
        this.setButtonCode(CHARGE_BUTTON, KEYBOARD_DEFAULT_CHARGE_CODE);
        this.setButtonCode(FLAME_BUTTON, KEYBOARD_DEFAULT_FLAME_CODE);
        this.setButtonCode(JUMP_BUTTON, KEYBOARD_DEFAULT_JUMP_CODE);
        this.setButtonCode(TALK_BUTTON, KEYBOARD_DEFAULT_TALK_CODE);
        this.setButtonCode(MOVE_LEFT_BUTTON, KEYBOARD_DEFAULT_MOVE_LEFT_CODE);
        this.setButtonCode(MOVE_RIGHT_BUTTON, KEYBOARD_DEFAULT_MOVE_RIGHT_CODE);
        this.setButtonCode(MOVE_UP_BUTTON, KEYBOARD_DEFAULT_MOVE_UP_CODE);
        this.setButtonCode(MOVE_DOWN_BUTTON, KEYBOARD_DEFAULT_MOVE_DOWN_CODE);
    }

    this.addKey = function(keycode){
        this.keycode[this.keys] = keycode;
        this.keystate[this.keys] = KEYBOARD_KEY_NOT_HELD;
        this.keys++;
        return this.keys-1;
    }

    this.isPressed = function(key){
        return this.keystate[key] === KEYBOARD_KEY_PRESSED;
    }

    this.isHeld = function(key){
        return this.keystate[key] === KEYBOARD_KEY_PRESSED ||
                this.keystate[key] === KEYBOARD_KEY_HELD;
    }

    this.isReleased = function(key){
        return this.keystate[key] === KEYBOARD_KEY_RELEASED;
    }

    this.update = function(){
        for(var n = 0; n < this.keys; n++){
            if( this.keystate[n] === KEYBOARD_KEY_PRESSED )
                this.keystate[n] = KEYBOARD_KEY_HELD;
            else if( this.keystate[n] === KEYBOARD_KEY_RELEASED )
                this.keystate[n] = KEYBOARD_KEY_NOT_HELD;
        }
    }

    this.resetButtonCodes();
}
