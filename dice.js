$(document).ready( function() {

	$('#roll').click( function() {
		Dice.roll();
	});
    
    $('#pair').click( function() {
        if ( Dice.pair1.length == 2 && Dice.pair2.length == 2 )
            Dice.evaluatePairs();
	});
	
	$('.dice').click( function() {
		var selected = Dice.toggle( $(this).attr( 'id' ) );
		
		if ( selected )
			$(this).css( 'border-color', '#F0F0FF' );
		else $(this).css( 'border-color', '#000000' );
	});

});

function clearUISelection()
{
    splitUIPair( Dice.pair1 );
    splitUIPair( Dice.pair2 );
    
	$('.dice').each( function() {
		$(this).css( 'border-color', '#000000' );
	});
}

function setUISelection()
{
    for ( i = 0; i < Dice.allDice.length; ++i )
    {
        var diceDiv = '#' + i + '>p';
        $(diceDiv).text( Dice.allDice[i].value );
    }
}

function setUIPair( pair )
{
    for ( i = 0; i < pair.length; ++i )
        $('#' +pair[i].id).appendTo( '.pairs' ).css( 'border-color', '#F0F0FF' );
        
    $('#values').text( 'Pair 1: ' + Dice.pairTotals[0] + '   Pair 2: ' + Dice.pairTotals[1] );
}

function splitUIPair( pair )
{
    for ( i = 0; i < pair.length; ++i )
    {
        pair[i].selected ?
            $( '#'+pair[i].id ).prependTo( '.form ' ).css( 'border-color', '#F0F0FF' ) :
            $( '#'+pair[i].id ).prependTo( '.form' ).css( 'border-color', '#000000' );
    }
            
    $('#values').text( 'Pair 1: ' + Dice.pairTotals[0] + '   Pair 2: ' + Dice.pairTotals[1] );
}

var Dice = {
	allDice	    : [],
	pair1	    : [],
	pair2       : [],
    pairTotals  : [0,0],
	paired      : 0,
	
	gameDice: function( val, diceID )
	{
		var gameDice = {
			value		: val,
			selected	: false,
			id		    : diceID,
		};
        
		this.allDice.push( gameDice );
	},
    
    evaluatePairs: function()
    {
        /* hook into Score Class */
    },
	
	clearPair: function( diceInfo )
	{
        if ( diceInfo.pair.length == 2 )
        {
            diceInfo.pair[0] + diceInfo.pair[1] == this.pairTotals[0] ?
                this.pairTotals[0] = 0 :
                this.pairTotals[1] = 0;
                
            splitUIPair( diceInfo.pair );
        }
        
        diceInfo.pair.splice( diceInfo.index, 1 );
	},
	
	getValue: function( pair, pairID )
	{
        this.pairTotals[ pairID ] = 0;
        
        for ( i = 0; i < pair.length; ++i )
            this.pairTotals[ pairID ] += pair[i].value;
            
        setUIPair( pair );
	},
    
    findDiceInPairs: function( dice )
    {
        for ( i = 0; i < this.pair1.length; ++i )
            if ( dice.id == this.pair1[i].id )
                return { pair : this.pair1, id : dice.id, index : this.pair1.indexOf( dice ) };

        for ( i = 0; i < this.pair2.length; ++i )
            if ( dice.id == this.pair2[i].id )
                return { pair : this.pair2, id : dice.id, index : this.pair2.indexOf( dice ) };
    },
	
	toggle: function( diceID )
	{
        var dice = this.allDice[ diceID ];
		var toggled = !dice.selected;
		dice.selected = toggled;
        
		if ( toggled )
		{
            if ( this.pair1.length == 2 && this.pair2.length == 2 )
            {
                dice.selected = false;
                return false;
            }
            
            this.paired++;
			
            if ( this.pair1.length < 2 )
                this.pair1.push( dice );
            else if ( this.pair2.length < 2 )
                this.pair2.push( dice );
            
            if ( this.pair1.length == 2 )
                this.getValue( this.pair1, 0 );
            if ( this.pair2.length == 2 )
                this.getValue( this.pair2, 1 );
		}
		else
		{
            var diceInfo = this.findDiceInPairs( dice );
			this.paired--;
            this.clearPair( diceInfo );
		}
		
		return toggled;
	},
	
	roll: function()
	{
		this.clearDice();
        
		for ( diceID = 0; diceID < 5; ++diceID )
		{
			var value = Math.floor( Math.random()*6 + 1 );
			this.gameDice( value, diceID );
		}
		
		setUISelection();
	},
	
	clearDice: function()
	{
        this.pairTotals = [0,0];
		clearUISelection();
		
		this.allDice    = [];
		this.pair1	    = [];
		this.pair2	    = [];
		this.paired	    = 0;
	},
};