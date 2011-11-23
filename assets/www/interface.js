$(document).ready( function() {

    $('#rollPair').on( 'touchStart', function(event) {
        if ( $(this).text() === 'Roll' ) {
            Dice.roll();
            UI.setDiceValues();
            UI.updateDice();
        }
        else if ( Dice.pair1.length === 2 && Dice.pair2.length === 2 ){
            Score.score_pairs();
            UI.updateScore();
            $('#rollPair').text( 'Roll' )
        }
    });
    
    $('.dice').on( 'touchStart', function(event) {
        var dice = Dice.allDice[ $(this).attr( 'id' ).match(/\d+/)[0] ];
        
        if ( Dice.pair1.length !== 2 || Dice.pair2.length !== 2 || dice.selected ) {
            Dice.toggle( dice );
            UI.updateDice();
        }
    });
    
    /*$('#rollPair').click( function() {
        if ( $(this).text() === 'Roll' ) {
            Dice.roll();
            UI.setDiceValues();
            UI.updateDice();
        }
        else if ( Dice.pair1.length === 2 && Dice.pair2.length === 2 ){
            Score.score_pairs();
            UI.updateScore();
            $('#rollPair').text( 'Roll' )
        }
    });
   
    $('.dice').click( function() {
        var dice = Dice.allDice[ $(this).attr( 'id' ).match(/\d+/)[0] ];
        
        if ( Dice.pair1.length !== 2 || Dice.pair2.length !== 2 || dice.selected ) {
            Dice.toggle( dice );
            UI.updateDice();
        }
    });*/

});

var UI = {
    updateDice: function() {
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
    },

    setDiceValues: function() {
        for ( var i = 0, l = Dice.allDice.length; i < l; ++i ) {
            var diceDiv = '#die-' + i + '>p';
            $(diceDiv).text( Dice.allDice[i].value );
        }
        
        $('#rollPair').text( 'Score' );
    },
    
    updateScore: function() {
        var score = Score.get_score();
        
        this.updatePointNotches();
        this.updateDeathNotch( Dice.getLoneDice() );
        $("#current-score").html(score);
    },
    
    updatePointNotches: function() {
        var offset = Dice.pairTotals[0] === Dice.pairTotals[1] ? 1 : 0;
        
        for ( var i = 0; i < 2; ++i ) {
            var pointNotch = '#point-row-' + Dice.pairTotals[i] + ' > :eq(' + (Score.point_row_counts[ Dice.pairTotals[i] ] - offset) + ')';
            var notchClass = $(pointNotch).attr( 'class' );
            var notchType  = notchClass.substr( notchClass.lastIndexOf( '-' ) + 1 );
            
            this.fillNotch( pointNotch, notchType );
            offset = 0;
        }
    },
    
    updateDeathNotch: function( dice ) {
        if ( Score.is_death_number( dice ) ) {
            if ( Score.death_row_counts[ dice.toString() ] === 1 ) {
                $('.death-row-die').each( function() {
                    if ( !$(this).text() ) {
                        $(this).text( dice );
                        return false;
                    }
                });
            }
            
            var deathNotches = '.death-row-die:contains(' + dice + ') ~ :not(.negative-filled)';
            $(deathNotches).filter( ':first' ).addClass( 'negative-filled' );
        }
    },
    
    fillNotch: function( pointNotch, notchType ) {
        if ( notchType === 'negative' || notchType === 'zero' ) {
            $(pointNotch).addClass( notchType + '-filled' );
        }
        else if ( !isNaN( notchType ) ) {               //add'l checks if it is greater than 4
            $(pointNotch).addClass( 'positive-filled' );
        }
    },
};

