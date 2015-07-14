
var CONTROLS_PRESSED = 1;
var CONTROLS_RELEASED = -1;
var CONTROLS_DOWN = 2;
var CONTROLS_UP = 0;

var CHARGE_BUTTON = 0;
var FLAME_BUTTON = 1;
var JUMP_BUTTON = 2;
var TALK_BUTTON = 3;
var MOVE_LEFT_BUTTON = 4;
var MOVE_RIGHT_BUTTON = 5;
var MOVE_UP_BUTTON = 6;
var MOVE_DOWN_BUTTON = 7;
var BUTTON_COUNT = 8;


function Controls(){
    this._state = new Array(BUTTON_COUNT);

    this.pressEvent = function(button){
        if(this._state[button] !== CONTROLS_DOWN){
            this._state[button] = CONTROLS_PRESSED;
        }
    }

    this.releaseEvent = function(button){
        this._state[button] = CONTROLS_RELEASED;
    }

    this.stepEndEvent = function(){
        for(var i = 0; i < BUTTON_COUNT; i++){
            if( this._state[i] === CONTROLS_PRESSED ){
                this._state[i] = CONTROLS_DOWN;
            } else if( this._state[i] === CONTROLS_RELEASED ){
                this._state[i] = CONTROLS_UP;
            }
        }
    }

    this.isPressed = function(button){
        return this._state[button] === CONTROLS_PRESSED;
    }

    this.isDown = function(button){
        return this._state[button] === CONTROLS_PRESSED ||
                this._state[button] === CONTROLS_DOWN;
    }

    this.isReleased = function(button){
        return this._state[button] === CONTROLS_RELEASED;
    }
}
