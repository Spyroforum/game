
/*function DialogPageOption(){
    this.message = "";
    this.nextPage = -1;
    this.action = null;
}*/

function DialogPage(title, message){
    this.title = title;
    this.message = message;
    //this.options = [];
}

function Dialog(){
    this.pages = [];
    this.currentPageId = 0;
    //this.closeAction = null;

    /**
        Jumps to next page if there is any left. (otherwise does nothing)
    */
    this.nextPage = function(){
        if(this.hasMorePages())
            this.currentPageId++;
    }

    this.currentPage = function(){
        return this.pages[this.currentPageId];
    }

    this.hasMorePages = function(){
        return (this.currentPageId + 1) < this.pages.length;
    }

    this.addPage = function(page){
        this.pages.push(page);
    }

    this.reset = function(){
        this.currentPageId = 0;
    }
}
