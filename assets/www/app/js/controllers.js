'use strict';

/* Controllers */


function HomeCtrl($scope, Score, Dice, HighScores) {
    $scope.current_score = Score.get_score();
    $scope.game_in_progress = Score.get_score() != 0;

    HighScores.recordScore(999);
    $scope.high_score = HighScores.getHighScore();

    $scope.continue_game = function() {
    };

    $scope.new_game = function() {
        Score.reset();
        Dice.reset();
    };
}
HomeCtrl.$inject = ["$scope", "Score", "Dice", "HighScores"];



function MyCtrl2() {
}
MyCtrl2.$inject = [];
