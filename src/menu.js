
var MENU_PAUSE_WIDTH = 128;
var MENU_PAUSE_HEIGHT = 128;
var MENU_PAUSE_BORDER_SIZE = 16;

/**
    Parameters:
        label - text displayed on the item
        x, y - position of the center of the item
        action - function to be called when triggered (no parameters)
*/
function MenuItem( label, x, y, action ){
    this.label = label;
    this.x = x;
    this.y = y;
    this.action = action;
}


/**
    Parameters:
        keyboard keys for moving to the next and previous item
*/
function MenuPage( nextKey, previousKey ){
    this.items = [];
    this.selectedItemID = 0;
    this.nextKey = nextKey;
    this.previousKey = previousKey;

    this.restart = function(){
        this.selectedItemID = 0;
    }
    
    this.step = function(){
        if( keyboard.isPressed(this.previousKey) ){
            this.selectPreviousItem();
        }
        if( keyboard.isPressed(this.nextKey) ){
            this.selectNextItem();
        }
        if( keyboard.isPressed(returnKey) ){
            this.selectedItem().action();
        }
    }
    
    this.draw = function(){
        for(var i = 0; i < this.items.length; i++){
            // current item has differend color than the other items
            if(i == this.selectedItemID)
                context.fillStyle = "rgba(255,255,255,1)";
            else
                context.fillStyle = "rgba(127,127,127,1)";
        
            drawText(context, this.items[i].label, this.items[i].x, this.items[i].y, "20px Arial", "center");
        }
    }
    
    /**
        see MenuItem constructor
    */
    this.addItem = function( label, x, y, action ){
        this.items.push( new MenuItem( label, x, y, action ) );
    }
    
    this.selectNextItem = function(){
        if( this.selectedItemID + 1 >= this.items.length ) return;
        this.selectedItemID++;
    }
    
    this.selectPreviousItem = function(){
        if( this.selectedItemID - 1 < 0 ) return;
        this.selectedItemID--;
    }

    this.selectedItem = function(){
        return this.items[this.selectedItemID];
    }
}


function MainMenu(){
    this.active = true;
    this.pages = [];
    this.currentPageID = 0;

    this.restart = function(){
        this.active = true;
        this.currentPageID = 0;
        for( var i = 0; i < this.pages.length; i++ ){
            this.pages[i].restart();
        }
    }
    
    this.step = function(){
        this.pages[ this.currentPageID ].step();
    }
    
    this.draw = function(){
        objCamera.setStaticView();
        context.fillStyle = "rgba(0,0,0,1)";
        objCamera.clear();
	    this.pages[ this.currentPageID ].draw();
    }

    // create pages for main menu:
    // first page asking if you want to run game or editor
    var page = new MenuPage( rightKey, leftKey );
    page.addItem( "Game", screenWidth / 2 - 64, 256, function(){ mainMenu.currentPageID++; } );
    page.addItem( "Editor", screenWidth / 2 + 64, 256, function(){ objEditor = new Editor(); mainMenu.active = false; } );
    this.pages.push( page );

    // second page asking if you want to run small or big level
    page = new MenuPage( rightKey, leftKey );
    page.addItem( "Small", screenWidth / 2 - 96, 256, function(){ changeLevel(1); } );
    page.addItem( "Big", screenWidth / 2, 256, function(){ changeLevel(0) } );
    page.addItem( "Yay", screenWidth / 2 + 96, 256, function(){ changeLevel(2) } );
    this.pages.push( page );
}


function PauseMenu(){
    this.active = false;
    this.pages = [];
    this.currentPageID = 0;

    this.restart = function(){
        this.active = false;
        this.currentPageID = 0;
        for( var i = 0; i < this.pages.length; i++ ){
            this.pages[i].restart();
        }
    }

    this.step = function(){
        if( keyboard.isPressed(escapeKey) ){
            this.active = false;
        } else {
            this.pages[ this.currentPageID ].step();
        }
    }

    this.draw = function(){
        var width = MENU_PAUSE_WIDTH;
        var height = MENU_PAUSE_HEIGHT;
        var x1 = (screenWidth - width) / 2;
        var x2 = x1 + width;
        var y1 = (screenHeight - height) / 2;
        var y2 = y1 + height;

        objCamera.setStaticView();
        context.fillStyle = "rgba(0,0,0,0.75)";
        context.fillRect(x1, y1 - MENU_PAUSE_BORDER_SIZE, width, height + 2*MENU_PAUSE_BORDER_SIZE);

        // draw border with rounded corners
        this.drawCorner( x2, y1, 270, 0 ); // right top
        this.drawCorner( x1, y1, 180, 270 ); // left top
        this.drawCorner( x1, y2, 90, 180 ); // left bottom
        this.drawCorner( x2, y2, 0, 90 ); // right bottom
        context.fillRect( x1 - MENU_PAUSE_BORDER_SIZE, y1, MENU_PAUSE_BORDER_SIZE, height ); // left
        context.fillRect( x2, y1, MENU_PAUSE_BORDER_SIZE, height ); // right

        this.pages[ this.currentPageID ].draw();
    }

    this.drawCorner = function( x, y, a1, a2 ){
        context.beginPath();
        context.arc( x, y, MENU_PAUSE_BORDER_SIZE, a1*Math.PI / 180, a2*Math.PI / 180, false );
        context.lineTo( x, y );
        context.fill();
    }

    // create pages for pause menu:
    // only first page at the moment
    var page = new MenuPage( downKey, upKey );
    page.addItem( "Continue", screenWidth / 2, screenHeight / 2 - 32, function(){ pauseMenu.restart(); } );
    page.addItem( "Main menu", screenWidth / 2, screenHeight / 2, goToMainMenu );
    this.pages.push( page );
}


function goToMainMenu(){
    objCamera.fadeOut( function(){
        objLevel = null;
        pauseMenu.restart();
        mainMenu.restart();;
    });
}


function changeLevel(id){
    objCamera.fadeOut( function(){
        objLevel = new PolygonLevel(id);
        objLevel.loadString(levelString[id]);
        objLevel.init();
        mainMenu.active = false;
    });
}
