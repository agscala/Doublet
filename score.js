var Score = {
    death_row_counts: {},
    point_row_counts: {},

    point_row_values: {
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
    },

    add_death_notch: function(dice_number) {
        if(Object.keys(this.death_row_counts).length < 3)
        {
            this.death_row_counts[dice_number.toString()] = 0;
        }

        if(this.is_death_number(dice_number))
        {
            this.death_row_counts[dice_number.toString()]++;
        }
    },

    is_death_number: function(dice_number) {
        return (this.death_row_counts[dice_number.toString()] !== NaN);
    },

    add_point_notch: function(pair_value) {
        if(2 <= pair_value && pair_value <= 12)
        {
            var notch_count = this.point_row_counts[pair_value.toString()] || 0;

            this.point_row_counts[pair_value.toString()] = notch_count + 1;
        }
    },

    get_score: function() {
        var total = 0;

        for(var row in this.point_row_counts) {
            if(this.point_row_counts.hasOwnProperty(row)) {
                console.log(row);
                var notches = this.point_row_counts[row];

                if(notches <= 4) {
                    total = total - 20;
                }
                else if(notches == 5) {
                }
                else if(notches >= 6 && notches <= 10) {
                    total = total + this.point_row_values[row];
                }

            }
        }
        console.log(total);
    },
};

Score.add_death_notch("1");
Score.add_death_notch("2");
Score.add_death_notch("3");
Score.add_death_notch("4");
Score.add_death_notch("4");

Score.add_point_notch("1");
Score.add_point_notch("2");
Score.add_point_notch("12");
Score.add_point_notch("12");
Score.add_point_notch("12");
Score.add_point_notch("12");

Score.get_score();
