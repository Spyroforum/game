window.addEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);
window.addEventListener("mousemove", mouseMove, false);
document.getElementById("gamecanvas").addEventListener("mousewheel", mouseWheel, false);
document.getElementById("gamecanvas").addEventListener("DOMMouseScroll", mouseWheelFirefox, false);

/**
    On Firefox the wheel event name is DOMMouseScroll instead of mousewheel. Wheel delta is
    recieved with e.detail instead of e.wheelDelta. The values are differend on chrome and firefox
    so I only make it contain eiter 1 (scroll up), -1 (scroll down) or 0 (idle)
*/
var mouse = {state:[], x:0, y:0, dx:0, dy:0, px:0, py:0, wdelta:0};


function mouseDown(e){
    mouse.state[e.button] = 1;
}


function mouseUp(e){
    mouse.state[e.button] = -1;
}


function mouseMove(e){
    mouse.px = mouse.x;
    mouse.py = mouse.y;
    getMousePosition(e);
}


function mouseWheel(e){
    mouse.wdelta = e.wheelDelta;

    if( mouse.wdelta > 0 )
        mouse.wdelta = 1;
    else if( mouse.wdelta < 0 )
        mouse.wdelta = -1;

    e.preventDefault();
    return false;
}


function mouseWheelFirefox(e){
    mouse.wdelta = e.detail;

    if( mouse.wdelta > 0 )
        mouse.wdelta = -1;
    else if( mouse.wdelta < 0 )
        mouse.wdelta = 1;

    e.preventDefault();
    return false;
}


mouse.isPressed = function(button){
    return this.state[button] == 1;
}


mouse.isHeld = function(button){
    return this.state[button] > 0;
}


mouse.isReleased = function(button){
    return this.state[button] == -1;
}


mouse.update = function(){
    for(var i = 0; i < 3; i++){
        if( this.state[i] == 1 ) this.state[i] = 2;
        else if( this.state[i] == -1 ) this.state[i] = 0;
    }

    this.wdelta = 0;
}


function getMousePosition(e){
    var posx = 0;
    var posy = 0;
    if(!e) var e = window.event;
    if(e.pageX || e.pageY){
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY){
        posx = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }

    var c = document.getElementById("gamecanvas");
    mouse.x = posx - c.offsetLeft;
    mouse.y = posy - c.offsetTop;
}

