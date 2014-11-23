
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
    
    this.draw = function(){
        context.font = "20px Arial";
        context.textAlign = 'center';
        context.fillText( this.label, this.x, this.y );
    }
}


/**
    Parameters:
        keyboard keys for moving to the next and previous item
*/
function MenuPage( nextKey, previousKey ){
    this.items = new Array();
    this.current_item = 0;
    this.nextKey = nextKey;
    this.previousKey = previousKey;

    this.restart = function(){
        this.current_item = 0;
    }
    
    this.step = function(){
        if( keyboard.isPressed(this.previousKey) ){
            this.previousItem();
        }
        if( keyboard.isPressed(this.nextKey) ){
            this.nextItem();
        }
        if( keyboard.isPressed(returnKey) ){
            this.items[ this.current_item ].action();
        }
    }
    
    this.draw = function(){
        for( i = 0; i < this.items.length; i++ ){
            // choose color for item text
            // current item has differend color than the other items
            if( i == this.current_item )
                context.fillStyle = "#FFFFFF";
            else
                context.fillStyle = "#888888";
        
            this.items[i].draw();
        }
    }
    
    /**
        see MenuItem constructor
    */
    this.addItem = function( label, x, y, action ){
        this.items.push( new MenuItem( label, x, y, action ) );
    }
    
    this.nextItem = function(){
        if( this.current_item + 1 >= this.items.length ) return;
        this.current_item++;
    }
    
    this.previousItem = function(){
        if( this.current_item - 1 < 0 ) return;
        this.current_item--;
    }
}


function MainMenu(){
    // variables:
    this.active = true;
    this.pages = [];
    this.current_page = 0;

    // functions:
    this.restart = function(){
        this.active = true;
        this.current_page = 0;
        for( var i = 0; i < this.pages.length; i++ ){
            this.pages[i].restart();
        }
    }
    
    this.step = function(){
        this.pages[ this.current_page ].step();
    }
    
    this.draw = function(){
        context.setTransform( 1, 0, 0, 1, 0, 0 );
        context.fillStyle = '#000000';
	    context.fillRect( 0, 0, screenWidth, screenHeight );
	    this.pages[ this.current_page ].draw();
    }

    // create pages for main menu:
    // first page asking if you want to run game or editor
    var page = new MenuPage( rightKey, leftKey );
    page.addItem( "Game", screenWidth / 2 - 64, 256, function(){ mainMenu.current_page++; } );
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
    // variables:
    this.active = false;
    this.pages = [];
    this.current_page = 0;

    // functions:
    this.restart = function(){
        this.active = false;
        this.current_page = 0;
        for( var i = 0; i < this.pages.length; i++ ){
            this.pages[i].restart();
        }
    }

    this.step = function(){
        if( keyboard.isPressed(escapeKey) ){
            this.active = false;
        } else {
            this.pages[ this.current_page ].step();
        }
    }

    this.draw = function(){
        var old_alpha = context.globalAlpha;
        var width = MENU_PAUSE_WIDTH;
        var height = MENU_PAUSE_HEIGHT;
        var x1 = (screenWidth - width) / 2;
        var x2 = x1 + width;
        var y1 = (screenHeight - height) / 2;
        var y2 = y1 + height;
        context.setTransform( 1, 0, 0, 1, 0, 0 );
        context.fillStyle = '#000000';
        context.globalAlpha = 0.75;
        context.fillRect( x1, y1 - MENU_PAUSE_BORDER_SIZE, width, height + 2*MENU_PAUSE_BORDER_SIZE );

        // draw border with rounded corners
        this.drawCorner( x2, y1, 270, 0 ); // right top
        this.drawCorner( x1, y1, 180, 270 ); // left top
        this.drawCorner( x1, y2, 90, 180 ); // left bottom
        this.drawCorner( x2, y2, 0, 90 ); // right bottom
        context.fillRect( x1 - MENU_PAUSE_BORDER_SIZE, y1, MENU_PAUSE_BORDER_SIZE, height ); // left
        context.fillRect( x2, y1, MENU_PAUSE_BORDER_SIZE, height ); // right

        context.globalAlpha = old_alpha;

        this.pages[ this.current_page ].draw();
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
        objLevel = new PolygonLevel(levelString[id]);
		objLevel.id = id;
        mainMenu.active = false;
    });
}
