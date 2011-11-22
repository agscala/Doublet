var Dice = {
    allDice     : [],
    pair1       : [],
    pair2       : [],
    pairTotals  : [0,0],
	
    gameDice: function( val, diceID ) {
        var gameDice = {
            value       : val,
            selected    : false,
            id          : diceID,
            pairID      : -1
        };

        this.allDice.push( gameDice );
    },
    	
    setNewRound: function() {
        Dice.pairTotals = [0,0];
        this.allDice    = [];
        this.pair1      = [];
        this.pair2      = [];
    },
    
    roll: function() {
        this.setNewRound();

        for ( var diceID = 0; diceID < 5; ++diceID ) {
            var value = Math.floor( Math.random()*6 + 1 );
            this.gameDice( value, diceID );
        }
    },
    
    toggle: function( dice ) {
        dice.selected = !dice.selected;

        dice.selected ?
            this.insertInPair( dice ) :
            this.clearPair( dice.pairID );
        
        this.updatePairTotals();
    },
    
    insertInPair: function( dice ) {
        if ( this.pair1.length < 2 ) {
            this.pair1.push( dice );
            dice.pairID = 0;
        }
        else if ( this.pair2.length < 2 ) {
            this.pair2.push( dice );
            dice.pairID = 1;
        }
    },
    
    clearPair: function( pairID ) {
        var pair = pairID === 0 ? this.pair1 : this.pair2;
        
        for ( var i = 0, l = pair.length; i < l; ++i ) {
            pair[i].selected = false;
            pair[i].pairID = -1;
        }
        
        this.pairTotals[ pairID ] = 0;
        pairID === 0 ? this.pair1 = [] : this.pair2 = [];
    },
	
    updatePairTotals: function() {
        this.pairTotals[0] = 0;
        this.pairTotals[1] = 0;

        for ( var i = 0, l = this.pair1.length; i < l; ++i ) {
            this.pairTotals[0] += this.pair1[i].value;
        }
            
        for ( var i = 0, l = this.pair2.length; i < l; ++i ) {
            this.pairTotals[1] += this.pair2[i].value;
        }
    },
    
    getLoneDice: function() {
        for ( var i = 0, l = this.allDice.length; i < l; ++i ) {
            if ( !this.allDice[i].selected ) {
                return this.allDice[i].value;
            }
        }
    },
};
