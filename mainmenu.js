
/**
    Parameters:
        label - string which is drawn
        x, y - posotion where the string is drawn
        action - function (with no parameters)
*/
function MenuItem( label, x, y, action ){
    this.label = label;
    this.x = x;
    this.y = y;
    this.action = action;
    
    this.draw = function(){
        context.font = "24px Arial";
        context.fillText( this.label, this.x, this.y );
    }
}


function MenuPage(){
    this.items = new Array();
    this.current_item = 0;
    
    this.step = function(){
        if( keyboard.isPressed(leftKey) ){
            this.previousItem();
        }
        if( keyboard.isPressed(rightKey) ){
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
    this.active = true;
    this.pages = new Array();
    this.current_page = 0;
    
    // create pages for main menu:
    // first page asking if you want to run game or editor
    var page = new MenuPage();
    page.addItem( "Game", 256-32, 256, function(){ mainMenu.current_page++; } );
    page.addItem( "Editor", 320+32, 256, function(){ objEditor = new Editor(); mainMenu.active = false; } );
    this.pages.push( page );
    
    // second page asking if you want to run small or big level
    page = new MenuPage();
    page.addItem( "Small", 256-32, 256, function(){ objLevel = new PolygonLevel(levelString[1]); mainMenu.active = false; } );
    page.addItem( "Big", 320+32, 256, function(){ objLevel = new PolygonLevel(levelString[0]); mainMenu.active = false; } );
    this.pages.push( page );
    
    
    this.step = function(){
        this.pages[ this.current_page ].step();
    }
    
    this.draw = function(){
        context.fillStyle = '#000000';
	    context.fillRect( 0, 0, screenWidth, screenHeight );
	    this.pages[ this.current_page ].draw();
    }
}

