'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1')
    .factory("Score", function() {
        var death_row_counts = {};
        var point_row_counts = {}
        var point_row_values = {
            "2": 10,
            "3": 7,
            "4": 6,
            "5": 5,
            "6": 4,
            "7": 3,
            "8": 4,
            "9": 5,
            "10": 6,
            "11": 7,
            "12": 10,
        };

        return {
            add_death_notch: function(dice_number) {
                if(this.get_death_row_length() !== 3 && !(dice_number.toString() in death_row_counts))
                {
                    death_row_counts[dice_number.toString()] = 0;
                }

                if(this.is_death_number(dice_number))
                {
                    death_row_counts[dice_number.toString()]++;
                }
            },

            is_death_number: function(dice_number) {
                console.log(dice_number);
                console.log(death_row_counts[dice_number.toString()] !== undefined);
                return (death_row_counts[dice_number.toString()] !== undefined);
            },

            add_point_notch: function(pair_value) {
                if(2 <= pair_value && pair_value <= 12)
                {
                    var notch_count = point_row_counts[pair_value.toString()] || 0;

                    point_row_counts[pair_value.toString()] = notch_count + 1;
                }
            },

            get_death_row_length: function() {
                var count = 0;

                for ( var k in death_row_counts ) {
                    if ( death_row_counts.hasOwnProperty(k) ) {
                    ++count;
                    }
                }

                return count;
            },

            get_score: function() {
                var total = 0;

                for(var row in point_row_counts) {
                    if(point_row_counts.hasOwnProperty(row)) {

                        var notches = point_row_counts[row];

                        if(notches <= 4) {
                            total = total - 20;
                        }
                        else if(notches == 5) {
                        }
                        else if(notches >= 6 && notches <= 10) {
                            total = total + point_row_values[row];
                        }
                    }
                }

                return total;
            },

            score_pairs: function() {
                this.add_point_notch( Dice.pairTotals[0] );
                this.add_point_notch( Dice.pairTotals[1] );
                this.add_death_notch( Dice.getLoneDice() );
            },

            reset: function() {
                death_row_counts = {};
                point_row_counts = {};
            },
        };
    })

    .factory("Dice", function() {
        var allDice     = [];
        var pair1       = [];
        var pair2       = [];
        var pairTotals  = [0, 0];

        return {
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
    })

    .factory("HighScores", function() {
        var highest_score = 0;

        return {
            getHighScore: function() {
                console.log(highest_score);
                return highest_score;
            },
            recordScore: function(score) {
                if (score > highest_score) {
                    highest_score = score;
                }
            },
        };
    })
