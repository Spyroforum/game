window.addEventListener("gamepadconnected", gamepadConnectedEvent);
window.addEventListener("gamepaddisconnected", gamepadDisconnectedEvent);

var GAMEPAD_PRESSED = 1;
var GAMEPAD_RELEASED = -1;
var GAMEPAD_DOWN = 2;
var GAMEPAD_UP = 0;

var GAMEPAD_DEFAULT_CHARGE_CODE = 3;
var GAMEPAD_DEFAULT_FLAME_CODE = 1;
var GAMEPAD_DEFAULT_JUMP_CODE = 2;
var GAMEPAD_DEFAULT_TALK_CODE = 0;
var GAMEPAD_DEFAULT_MOVE_LEFT_CODE = 20;
var GAMEPAD_DEFAULT_MOVE_RIGHT_CODE = 21;
var GAMEPAD_DEFAULT_MOVE_UP_CODE = 22;
var GAMEPAD_DEFAULT_MOVE_DOWN_CODE = 23;

function gamepadConnectedEvent(e){
    if(typeof gamepad != "undefined"){
        gamepad._handle = e.gamepad;
        var size = gamepad._handle.buttons.length + gamepad._handle.axes.length * 2;
        gamepad._codeState = new Array(size);

        for(var i = 0; i < gamepad._codeState.length; i++){
            gamepad._codeState[i] = GAMEPAD_UP;
        }
    }
}

function gamepadDisconnectedEvent(e){
    if(typeof gamepad != "undefined"){
        gamepad._handle = null;
        gamepad._codeState = null;
    }
}

function Gamepad(){
    this._handle = null;
    this._codeState = null;
    this._buttonCodes = new Array(BUTTON_COUNT);

    this.setButtonCode = function(button, code){
        this._buttonCodes[button] = code;
    }

    this.resetButtonCodes = function(){
        this.setButtonCode(CHARGE_BUTTON, GAMEPAD_DEFAULT_CHARGE_CODE);
        this.setButtonCode(FLAME_BUTTON, GAMEPAD_DEFAULT_FLAME_CODE);
        this.setButtonCode(JUMP_BUTTON, GAMEPAD_DEFAULT_JUMP_CODE);
        this.setButtonCode(TALK_BUTTON, GAMEPAD_DEFAULT_TALK_CODE);
        this.setButtonCode(MOVE_LEFT_BUTTON, GAMEPAD_DEFAULT_MOVE_LEFT_CODE);
        this.setButtonCode(MOVE_RIGHT_BUTTON, GAMEPAD_DEFAULT_MOVE_RIGHT_CODE);
        this.setButtonCode(MOVE_UP_BUTTON, GAMEPAD_DEFAULT_MOVE_UP_CODE);
        this.setButtonCode(MOVE_DOWN_BUTTON, GAMEPAD_DEFAULT_MOVE_DOWN_CODE);
    }

    this.isActive = function(){
        return this._handle !== null;
    }

    this.stepBeginEvent = function(){
        if(!this.isActive()) return;

        for(var i = 0; i < this._handle.buttons.length; i++){
            var pressed = this._handle.buttons[i].pressed;
            this._updateState(i, pressed);
        }

        for(var i = 0; i < this._handle.axes.length; i++){
            var code1 = this._handle.buttons.length + 2*i;
            var code2 = this._handle.buttons.length + 2*i + 1;
            var value = this._handle.axes[i];
            var pressed1 = false;
            var pressed2 = false;

            if(value < -0.5){
                pressed1 = true;
            } else if(value > 0.5){
                pressed2 = true;
            }

            this._updateState(code1, pressed1);
            this._updateState(code2, pressed2);
        }
    }

    this._updateState = function(code, pressed){
        var state = this._codeState[code];
        if(pressed){
            if(state === GAMEPAD_PRESSED || state === GAMEPAD_DOWN){
                this._codeState[code] = GAMEPAD_DOWN;
            } else {
                this._codeState[code] = GAMEPAD_PRESSED;
                this._pressEvent(code);
            }
        } else {
            if(state === GAMEPAD_RELEASED || state === GAMEPAD_UP){
                this._codeState[code] = GAMEPAD_UP;
            } else {
                this._codeState[code] = GAMEPAD_RELEASED;
                this._releaseEvent(code);
            }
        }
    }

    this._pressEvent = function(code){
        debug("code: " + code);

        if(typeof controls !== "undefined"){
            for(var i = 0; i < BUTTON_COUNT; i++){
                if(code === this._buttonCodes[i]){
                    controls.pressEvent(i);
                }
            }
        }
    }

    this._releaseEvent = function(code){
        if(typeof controls !== "undefined"){
            for(var i = 0; i < BUTTON_COUNT; i++){
                if(code === this._buttonCodes[i]){
                    controls.releaseEvent(i);
                }
            }
        }
    }

    this.resetButtonCodes();
}
