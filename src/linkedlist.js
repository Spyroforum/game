
function LinkedListItem(data){
    this.data = data;
    this.next = null;
    this.previous = null;
}


function LinkedList(){

    this._first = null;
    this._last = null;
    this._current = null;

    this.addLast = function(data){
        var item = new LinkedListItem(data);
        if(this._first === null){
            this._first = item;
            this._last = item;
            this._current = item;
        } else {
            this._last.next = item;
            item.previous = this._last;
            this._last = item;
        }
    }

    this.getFirst = function(){
        return this._first.data;
    }

    this.getLast = function(){
        return this._last.data;
    }

    this.getCurrent = function(){
        return this._current.data;
    }

    this.next = function(){
        var nextItem = this._current.next;
        if(nextItem !== null) this._current = nextItem;
    }

    this.previous = function(){
        var previousItem = this._current.previous;
        if(previousItem !== null) this._current = previousItem;
    }

    this.iterate = function(self, fun){
        var currentItem = this._first;
        while(currentItem !== null){
            fun(self, currentItem.data);
            currentItem = currentItem.next;
        }
    }
}
