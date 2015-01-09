
var DEFAULT_LIVES_COUNT = 5;


function LevelSaveData(){
    this._gemCount = 0;
    this._gemCollected = [];
    this._chestCollected = [];

    this.getGemCount = function(){
        return this._gemCount;
    }

    /**
        Increases gem count by value and stores id of the gem which was collected.
    */
    this.setGemCollected = function(gemId, value){
        this._gemCount += value;
        this._gemCollected[gemId] = true;
    }

    /**
        Stores id of cehst which was collected.
    */
    this.setChestCollected = function(chestId){
        this._chestCollected[chestId] = true;
    }

    /**
        returns:
            true if gem was collected
            false otherwise
    */
    this.isGemCollected = function(gemId){
        return this._gemCollected[gemId] === true;
    }

    this.isChestCollected = function(chestId){
        return this._chestCollected[chestId] === true;
    }

    this.toString = function(){
        var rval = "";
        rval += "Gem count: " + this._gemCount + " </br>";
        rval += "Gems collected: ";

        for(var i = 0; i < this._gemCollected.length; i++){
            if(this.isGemCollected(i))
                rval += "1 ";
            else
                rval += "0 "
        }

        rval += " </br> Chests collected: ";

        for(var i = 0; i < this._chestCollected.length; i++){
            if(this.isChestCollected(i))
                rval += "1 ";
            else
                rval += "0 "
        }

        return rval;
    }
}


function SaveData(){
    this.lives = DEFAULT_LIVES_COUNT;
    this._gemCount = 0;
    this._levelsData = [];

    /**
        Increases gem count by value and calls LevelSaveData.setGemCollected function.
        New save game data for given level are created if it does not exist yet.
    */
    this.setGemCollected = function(levelId, gemId, value){
        this._gemCount += value;

        if(this._levelsData[levelId] === undefined)
            this._levelsData[levelId] = new LevelSaveData();

        this._levelsData[levelId].setGemCollected(gemId, value);
    }

    this.setChestCollected = function(levelId, chestId){
        if(this._levelsData[levelId] === undefined)
            this._levelsData[levelId] = new LevelSaveData();

        this._levelsData[levelId].setChestCollected(chestId);
    }

    /**
        true if gem was collected in the level
        false otherwise
    */
    this.isGemCollected = function(levelId, gemId){
        if(this._levelsData[levelId] === undefined) return false;
        else return this._levelsData[levelId].isGemCollected(gemId);
    }

    this.isChestCollected = function(levelId, chestId){
        if(this._levelsData[levelId] === undefined) return false;
        else return this._levelsData[levelId].isChestCollected(chestId);
    }

    this.getGemCount = function(){
        return this._gemCount;
    }

    this.getLevelGemCount = function(levelId){
        if(this._levelsData[levelId] === undefined) return 0;
        return this._levelsData[levelId].getGemCount();
    }

    this.toString = function(levelId){
        var rval = "Save data: </br>";
        rval += "Lives: " + this.lives + "</br>";
        rval += "Total gem count: " + this._gemCount + "</br>";

        if(this._levelsData[levelId] === undefined)
            return rval;
        else
            rval += this._levelsData[levelId].toString();

        return rval;
    }
}
