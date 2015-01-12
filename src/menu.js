
var MENU_PAUSE_WIDTH = 160;
var MENU_PAUSE_HEIGHT = 160;
var MENU_PAUSE_CORNER_SIZE = 16;

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
    this.pages = [];
    this.currentPageID = 0;
    
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
    page.addItem( "Editor", screenWidth / 2 + 64, 256, goToEditor );
    this.pages.push( page );

    // second page asking if you want to run small or big level
    page = new MenuPage( rightKey, leftKey );
    page.addItem( "Small", screenWidth / 2 - 96, 256, function(){ changeLevel(1); } );
    page.addItem( "Big", screenWidth / 2, 256, function(){ changeLevel(0) } );
    page.addItem( "Yay", screenWidth / 2 + 96, 256, function(){ changeLevel(2) } );
    this.pages.push( page );
}


function PauseMenu(){
    this.pages = [];
    this.currentPageID = 0;

    this.step = function(){
        this.pages[ this.currentPageID ].step();
        objCamera.infoPanelGems.show();
        objCamera.infoPanelLives.show();
    }

    this.draw = function(){
        objCamera.setStaticView();
        context.fillStyle = "rgba(0,0,0,0.75)";
        drawRectangleRounded(context,
                             (screenWidth - MENU_PAUSE_WIDTH) / 2,
                             (screenHeight - MENU_PAUSE_HEIGHT) / 2,
                             MENU_PAUSE_WIDTH,
                             MENU_PAUSE_HEIGHT,
                             MENU_PAUSE_CORNER_SIZE);

        this.pages[ this.currentPageID ].draw();
    }

    // create pages for pause menu:
    // only first page at the moment
    var page = new MenuPage( downKey, upKey );
    page.addItem( "Continue", screenWidth / 2, screenHeight / 2 - 32, function(){ objLevel.pauseMenu = null; } );
    page.addItem( "Main menu", screenWidth / 2, screenHeight / 2, goToMainMenu );
    this.pages.push( page );
}


function goToMainMenu(){
    objCamera.fadeOut( function(){
        mainMenu = new MainMenu();
        objLevel = null;
        objEditor = null;
    });
}


function goToEditor(){
    objCamera.fadeOut( function(){
        objEditor = new Editor();
        mainMenu = null;
        objLevel = null;
    });
}


function changeLevel(id){
    objCamera.fadeOut( function(){
        objSparx.eatButterfly();
        objLevel = new PolygonLevel(id);
        objLevel.loadString(levelString[id]);
        objLevel.init();
        objCamera.infoPanelGems.show();
        objCamera.infoPanelLives.show();
        mainMenu = null;
        objEditor = null;
    });
}
