
var MENU_PAUSE_WIDTH = 160;
var MENU_PAUSE_HEIGHT = 160;
var MENU_PAUSE_CORNER_SIZE = 16;

var MENU_SELECTED_ITEM_COLOR = "rgba(255,255,255,1)";
var MENU_NOT_SELECTED_ITEM_COLOR = "rgba(127,127,127,1)";

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

    this.step = function(){
        return false;
    }

    this.draw = function(selected){
        if(selected){
            context.fillStyle = MENU_SELECTED_ITEM_COLOR;
        } else {
            context.fillStyle = MENU_NOT_SELECTED_ITEM_COLOR;
        }
        drawText(context, this.label, this.x, this.y, "20px Arial", "center");
    }
}


/**
    Parameters:
        keyboard keys for moving to the next and previous item
*/
function MenuPage( nextKey, previousKey ){
    this._items = new LinkedList();
    this._nextKey = nextKey;
    this._previousKey = previousKey;
    
    this.step = function(){
        if(this._items.getCurrent().step()) return;

        if( keyboard.isPressed(this._previousKey) ){
            this._items.previous();
        }
        if( keyboard.isPressed(this._nextKey) ){
            this._items.next();
        }
        if( keyboard.isPressed(returnKey) ){
            this._items.getCurrent().action();
        }
    }
    
    this.draw = function(){
        this._items.iterate(this, function(self, item){
            item.draw(item === self._items.getCurrent());
        });
    }
    
    this.addItem2 = function(item){
        this._items.addLast(item);
    }

    this.addItem = function(label, x, y, action){
        this._items.addLast(new MenuItem(label, x, y, action));
    }
}


function MainMenu(){
    this.pages = [];
    this.currentPage = null;
    
    this.step = function(){
        this.currentPage.step();
    }
    
    this.draw = function(){
        objCamera.setStaticView();
        context.fillStyle = "rgba(0,0,0,1)";
        objCamera.clear();
	    this.currentPage.draw();
    }

    // create pages for main menu:
    // first page asking if you want to run game or editor
    var swh = screenWidth / 2;
    var page = new MenuPage( rightKey, leftKey );
    page.addItem( "Game", swh - 96, 256, function(){ mainMenu.currentPage = mainMenu.pages[1]; } );
    page.addItem( "Editor", swh, 256, goToEditor );
    //page.addItem("Keyboard", swh + 96, 256, function(){ mainMenu.currentPage = mainMenu.pages[2]; });
    this.pages.push( page );
    this.currentPage = page;

    // second page asking if you want to run small or big level
    page = new MenuPage( rightKey, leftKey );
    page.addItem( "Small", swh - 96, 256, function(){ changeLevel(1); } );
    page.addItem( "Big", swh, 256, function(){ changeLevel(0) } );
    page.addItem( "Yay", swh + 96, 256, function(){ changeLevel(2) } );
    this.pages.push( page );

    // third page for key editation
    /*page = new MenuPage(downKey, upKey);
    page.addItem2(new MenuKeyChangeItem("Jump", swh, 64));
    page.addItem2(new MenuKeyChangeItem("Flame", swh, 64+32*1));
    page.addItem2(new MenuKeyChangeItem("Charge", swh, 64+32*2));
    page.addItem2(new MenuKeyChangeItem("Talk", swh, 64+32*3));
    page.addItem2(new MenuKeyChangeItem("Move left", swh, 64+32*4));
    page.addItem2(new MenuKeyChangeItem("Move right", swh, 64+32*5));
    page.addItem2(new MenuItem("Done", swh, 64+32*7, function(){ mainMenu.currentPage = mainMenu.pages[0]; }));
    this.pages.push(page);*/
    // add reset to defaults button
}


function PauseMenu(){
    this.pages = [];
    this.currentPage = null;

    this.step = function(){
        this.currentPage.step();
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

        this.currentPage.draw();
    }

    // create pages for pause menu:
    // only first page at the moment
    var page = new MenuPage( downKey, upKey );
    page.addItem( "Continue", screenWidth / 2, screenHeight / 2 - 32, function(){ objLevel.pauseMenu = null; } );
    page.addItem( "Main menu", screenWidth / 2, screenHeight / 2, goToMainMenu );
    this.pages.push( page );
    this.currentPage = page;
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
