// JS module pattern

// define NAMESPACE
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Score = (function(){
    // private properties
    model = undefined;
    scoreControl = undefined;
 
    // private functions
    function setScore() {
       console.log("Score::setScore()");
       var score = model.getValue("score");
       if (score === undefined) {
         model.setValue("score", 0);
         score = "00";
         }
       scoreControl.innerHTML = "00" + score;
    }

    // module properties
    var Score = function(){
        this.moduleProperty = 1;
        return this;
    };

    // module methods
    Score.prototype.increase = function(i) {
        console.log("Score::increase()");
        var myScore = model.getValue("score");
        if (i == undefined) {
            i = 1;
            } 
        if (myScore == undefined) {
            myScore = i;
            } 
        else {
            myScore += i;
            }
        model.setValue("score", myScore);
        }

    Score.prototype.init = function(_model) {
        console.log("Score::init()");
        model = _model;
        scoreControl = document.getElementById("score");
        document.addEventListener('DataChanged', setScore, false);
        };
    return Score;
})();
// end of MODULE

// create instance
var instance = new LernDieUhr.Score();
