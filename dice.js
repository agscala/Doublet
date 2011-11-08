$(document).ready( function() {

    $('#roll').click( function() {
        Dice.roll();
        setDiceValuesUI();
        updateUI();
    });
   
    $('.dice').click( function() {
        var dice = Dice.allDice[ $(this).attr( 'id' ) ];
        
        if ( Dice.pair1.length != 2 || Dice.pair2.length != 2 || dice.selected )
        {
            Dice.toggle( dice );
            updateUI();
        }
    });
 
    $('#pair').click( function() {
        if ( Dice.pair1.length == 2 && Dice.pair2.length == 2 )
            Dice.evaluatePairs();
    });
	
});

function updateUI()
{
    for ( var i = 0, l = Dice.allDice.length; i < l; ++i )
    {
        var diceElem = '#' + Dice.allDice[i].id;
        
        if ( Dice.allDice[i].pairID != -1 )
        {
            $(diceElem).css( 'border-color', '#ACF0BF' );
            
            if ( !$('.pairs >' + diceElem).length )
                $(diceElem).appendTo( '#pair' + Dice.allDice[i].pairID );
        }
        else 
        {
            $(diceElem).css( 'border-color', '#000000' );
            
            if ( !$('.form >' + diceElem).length )
                $(diceElem).prependTo( '.form');
        }
    }
    
    $('#values').text( 'Pair 1: ' + Dice.pairTotals[0] + '   Pair 2: ' + Dice.pairTotals[1] );
}

function setDiceValuesUI()
{
    for ( var i = 0, l = Dice.allDice.length; i < l; ++i )
    {
        var diceDiv = '#' + i + '>p';
        $(diceDiv).text( Dice.allDice[i].value );
    }
}

var Dice = {
    allDice     : [],
    pair1       : [],
    pair2       : [],
    pairTotals  : [0,0],
    paired      : 0,
	
    gameDice: function( val, diceID )
    {
        var gameDice = {
            value       : val,
            selected    : false,
            id          : diceID,
            pairID      : -1
        };

        this.allDice.push( gameDice );
    },
    
    evaluatePairs: function()
    {
        /* Finalizes pairs, hooks into Score Class */
    },
	
    clearPair: function( pairID )
    {
        var pair = pairID == 0 ? this.pair1 : this.pair2;
        
        for ( var i = 0, l = pair.length; i < l; ++i )
        {
            pair[i].selected = false;
            pair[i].pairID = -1;
            this.paired--;
        }
        
        this.pairTotals[ pairID ] = 0;
        pairID == 0 ? this.pair1 = [] : this.pair2 = [];
    },
	
    updateScore: function()
    {
        this.pairTotals[0] = 0;
        this.pairTotals[1] = 0;

        for ( var i = 0, l = this.pair1.length; i < l; ++i )
            this.pairTotals[0] += this.pair1[i].value;
            
        for ( var i = 0, l = this.pair2.length; i < l; ++i )
            this.pairTotals[1] += this.pair2[i].value;
    },
    
    toggle: function( dice )
    {
        dice.selected = !dice.selected;

        if ( dice.selected )
        {
            this.paired++;
            this.insertInPair( dice );
        }
        else this.clearPair( dice.pairID );
        
        this.updateScore();
    },
    
    insertInPair: function( dice )
    {
        if ( this.pair1.length < 2 )
        {
            this.pair1.push( dice );
            dice.pairID = 0;
        }
        else if ( this.pair2.length < 2 )
        {
            this.pair2.push( dice );
            dice.pairID = 1;
        }
    },
	
    roll: function()
    {
        this.setNewRound();

        for ( var diceID = 0; diceID < 5; ++diceID )
        {
            var value = Math.floor( Math.random()*6 + 1 );
            this.gameDice( value, diceID );
        }
    },
	
    setNewRound: function()
    {
        Dice.pairTotals = [0,0];
        this.allDice    = [];
        this.pair1      = [];
        this.pair2      = [];
        this.paired     = 0;
    },
};
