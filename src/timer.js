
/*
    Paramaters:
        time - the number of ticks until event function is called
*/
function Timer(time){
    this.tTicks = time; // target number of ticks
    this.cTicks = 0; // current number of ticks


    /*
        Increases cTicks by one.
        If cTicks is equal to tTicks, then event function is called.
        (the default event function is reset)

        Returns:
            true - if event function called
            false - otherwise
    */
    this.tick = function(){
        if(this.cTicks == this.tTicks){
            this.event();
            return true;
        } else {
            this.cTicks++;
            return false;
        }
    }


    /*
        Sets number of ticks to zero.

        Parameters:
            ntime (int) [optional] - new nmber of ticks until calling event function
    */
    this.reset = function(ntime){
        if(typeof ntime !== "undefined"){
            this.tTicks = ntime;
        }

        this.cTicks = 0;
    }

    this.event = this.reset;
}



function SubTimer(delay){
    this.old = Date.now(); // time in milis of last update
    this.stack = 0; // every update is raised by current and old time difference
                     // its value is then reduced in Timer.stepReady or Timer.drawReady functions
    this.delay = delay; // time inerval in milis between steps/frames
    this.min_delay = delay; // note: draw timer only
    this.max_delay = 1000; // note: draw timer only
        
	
    /**
        Updates stack value.
        
        Returns:
            true  - stack is >= delay - there are some steps/frames to do
            false - stack is < delay - no more steps/frames to do
    */
    this.ready = function(){
        this.stack += Date.now() - this.old;
        this.old = Date.now();
        
        return this.stack >= this.delay;
    }
    
    
    /**
        Adds 1 to delay.
        Delay won't get past its maximum.
        note: draw timer only
    */
    this.moreDelay = function(){
        this.delay++;
        if( this.delay > this.max_delay )
            this.delay = this.max_delay;
    }
    
    
    /**
        Adds -10 to delay. (previously -1)
        Delay won't get below its minimum.
        note: draw timer only
    */
    this.lessDelay = function()
    {
        this.delay-=10;//--;
        if( this.delay < this.min_delay )
            this.delay = this.min_delay;
    }
}


function MainTimer( delay, fstep, fdraw ){
    this.step_timer = new SubTimer(delay);
    this.draw_timer = new SubTimer(delay);
    this.step_function = fstep; // function to be called every step
    this.draw_function = fdraw; // function to be called every frame
    
    
    this.update = function(){
        while( this.isStepReady() ){
            gameStep();
        }
        
        if( this.isDrawReady() ){
            gameDraw();
        }
    }
    
    
    /**
        Updates stack value for step timer.
        
        Returns:
            true  - stack is >= delay - there are some steps to do
            false - stack is < delay - no more steps to do
    */
    this.isStepReady = function(){
        var rval = this.step_timer.ready()
        
        if(rval){
            // stack is not set to 0 so no steps are lost
            // the step function is called as many times as it is needed
            // but in case of constant lag caused by non graphical stuff (for example collisions)
            // some steps will be dropped to prevent uncontrollable rising of the stack value 
            this.step_timer.stack -= this.step_timer.delay; // note: stack is always >= delay here
            if( this.step_timer.stack > 2000 ) this.step_timer.stack = 2000;
        
            // auto FPS change
            if( this.step_timer.stack > this.step_timer.min_delay )
                this.draw_timer.moreDelay();
            else
                this.draw_timer.lessDelay();

            elementSetText("fps", "FPS: " + (1000 / this.draw_timer.delay));
        }
        
        return rval;
    }
    
    
    /**
        Updates stack value for draw timer.
        
        Returns:
            true  - stack is >= delay - repaint needed
            false - stack is < delay - no repaint needed
    */
    this.isDrawReady = function(){
        var rval = this.draw_timer.ready()
    
        if(rval){
            // some frames will be drpped
            this.draw_timer.stack = 0;
        }
    
        return rval;
    }
}
