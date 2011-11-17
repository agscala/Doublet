$(document).ready( function() {

    $('#rollPair').click( function() {
        if ( $(this).text() === 'Roll' ) {
            Dice.roll();
            setDiceValuesUI();
            updateUI();
        }
        else if ( Dice.pair1.length === 2 && Dice.pair2.length === 2 ){
            Dice.scorePairs();
            $('#rollPair').text( 'Roll' )
        }
    });
   
    $('.dice').click( function() {
        var dice = Dice.allDice[ $(this).attr( 'id' ).match(/\d+/)[0] ];
        
        if ( Dice.pair1.length !== 2 || Dice.pair2.length !== 2 || dice.selected ) {
            Dice.toggle( dice );
            updateUI();
        }
    });
	
});

function updateUI() {
    for ( var i = 0, l = Dice.allDice.length; i < l; ++i ) {
        var diceElem = '#die-' + Dice.allDice[i].id;
        
        if ( Dice.allDice[i].pairID !== -1 ) {
            $(diceElem).css( 'border-color', '#ACF0BF' );
            
            if ( !$('.pairs-wrapper ' + diceElem).length ) {
                $(diceElem).appendTo( '#pair-' + Dice.allDice[i].pairID );
            }
        }
        else {
            $(diceElem).css( 'border-color', '#000000' );
            
            if ( !$('#dice-wrapper >' + diceElem).length ) {
                $(diceElem).prependTo( '#dice-wrapper');
            }
        }
    }
    
    if ( Dice.pair1.length === 2 && Dice.pair2.length === 2 ) {
        $('#rollPair').removeAttr( 'disabled' );
    }
    
    $('#values').text( 'Pair 1: ' + Dice.pairTotals[0] + '   Pair 2: ' + Dice.pairTotals[1] );
}

function setDiceValuesUI() {
    for ( var i = 0, l = Dice.allDice.length; i < l; ++i ) {
        var diceDiv = '#die-' + i + '>p';
        $(diceDiv).text( Dice.allDice[i].value );
    }
    
    $('#rollPair').text( 'Score' );
}

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
    
    scorePairs: function() {
        /* Finalizes pairs, hooks into Score Class */
    },
};
