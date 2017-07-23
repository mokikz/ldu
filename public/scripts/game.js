// JS module pattern

// define NAMESPACE
var LernDieUhr = window.LernDieUhr || {};
LernDieUhr.Game = (function(){
    // private properties
    
    questionControl = undefined;
    character = undefined;
    score = undefined;
    that = undefined;
    model;

    function hideDialog(id) {
        console.log("Game::hideDialog(" + id + ")");
        var dialog = document.getElementById(id);
        if (dialog) {
          dialog.style.display = "none";
          }
        // play animation and move to next level
        // dialog.style.animationPlayState = "paused";
    }

    function showDialog(id) {
        console.log("Game::showDialog(" + id + ")");
        var dialog = document.getElementById(id);
        if (dialog) {
          dialog.style.display = "block";
          }
        // play animation and move to next level
        var text = document.getElementById(id + "Text");
        if (text) {
          text.style.animationPlayState = "running";
          //dialog.style.webkitanimationPlayState = "running";
          }
    }

    function restartGame() {
	hideDialog("ContinueGame");
	}

    function continueGame() {
        hideDialog("ContinueGame");
	}

    function gameLoop (timestamp) {
	// redraw all visible characters
        window.requestAnimationFrame(gameLoop);
        for (index = 0; index < a.length; ++index) {
	  a[index].update(timestamp);
	  a[index].render(timestamp);
          }
	}


    // private functions
    function levelCompleted() {
        // read current time from model
        console.log("Game::levelCompleted()");
        var hour;
        var minute;
        if (isIE) {
            var temp = new Array();
            temp= model.getTime();
            hour = temp[0];
            minute = temp[1];
            }
        else {
            [hour, minute] = model.getTime();
            }

        // compare with asked time
        var currentWorld = model.getValue("currentWorld");
        var levelsOfWorld = levels[currentWorld]['levels'];

        var currentLevel =  model.getValue("currentLevel");
        var levelData = levelsOfWorld[currentLevel];
        var wantedHour = levelData["zielHour"];
        var wantedMinute = levelData["zielMinute"];
        if ((wantedHour%12 == hour%12) && (wantedMinute == minute)) {
        //if (((wantedHour == hour) && (wantedMinute == minute))||
        //    ((wantedHour == hour-12) && (wantedMinute == minute))){
            // show LevelDone
            showDialog("LevelDone");
            // increase score
            model.increaseValue("score");
            setTimeout(hideDialog, 2000, "LevelDone");
            that.loadLevel();
            model.persist();
            }
        else {
            // show failure
            showDialog("LevelFailed");
            that.loadLevel(true);
            setTimeout(hideDialog, 2000, "LevelFailed");
            }
    }

function registerEvents() {
      console.log("Game::registerEvents()");
      var text = document.getElementById("LevelDoneText");
      text.addEventListener('AnimationEnd', function(){this.style.animationPlayState = "paused"}, false);
      text = document.getElementById("LevelDoneFailed");
      text.addEventListener('AnimationEnd', function(){this.style.animationPlayState = "paused"}, false);
    }


    // module properties
    var Game = function(){
        console.log("Game::Construktor()");
        this.moduleProperty = 1;
        return this;
    };

    // module methods
    Game.prototype.hideDialog = function(id) {
        return hideDialog(id);
        }

    Game.prototype.showDialog = function(id) {
        return showDialog(id);
        }

    Game.prototype.getNextWorld = function(currentWorld) {
        var klasse = model.getValue("Klasse");
        var numOfWorlds = levels.length;
        var nextWorld = currentWorld;
        var nextKlasse;
        var found = false;
        do {
          nextWorld = nextWorld +1;
          nextKlasse = levels[nextWorld]['klasse'];
          if ($.inArray( klasse, nextKlasse) > -1) {
            found = true;
            }
        } while ((found == false) && (nextWorld <= numOfWorlds));
        return nextWorld;
        }

    Game.prototype.loadLevel = function(bLoadCurrentLevel) {
        console.log("Game::loadLevel()");
        var numOfWorlds = levels.length;
        var currentWorld = model.getValue("currentWorld");
        if (currentWorld == -1) {
          currentWorld = that.getNextWorld(currentWorld);
          model.setValue("currentWorld", currentWorld);
          }
        var levelsOfWorld = levels[currentWorld]['levels'];
        var currentLevel = model.getValue("currentLevel");
        if (bLoadCurrentLevel == undefined) {
            // move to next level
            currentLevel++;
            model.setValue("currentLevel", currentLevel);
            // if world completed emit event
            var maxLevelOfWorld = levelsOfWorld.length -1;
            if (currentLevel > maxLevelOfWorld) {
                // TODO: move to next world with some reward for player
                currentWorld = that.getNextWorld(currentWorld);
                if (currentWorld >= numOfWorlds) {
                  // more levels soon
                  showDialog("AllCompleted");
                  
                  return;
                  }
                showDialog("WorldCompleted");
                model.setValue("currentWorld", currentWorld);
                currentLevel = 0;
                model.setValue("currentLevel", currentLevel);
                levelsOfWorld = levels[currentWorld]['levels'];
                }
            }
        
        if (currentLevel >= levelsOfWorld.length -1) { // user quit before starting new world, take care
          currentWorld += 1;
          if ( currentWorld >= numOfWorlds) {
            // more levels soon
            showDialog("AllCompleted");
            return;
            }
          showDialog("WorldCompleted");
          model.setValue("currentWorld", currentWorld);
          currentLevel = 0;
          model.setValue("currentLevel", currentLevel);
          levelsOfWorld = levels[currentWorld]['levels'];
          }
        var levelData = levelsOfWorld[currentLevel];
        // set clock to start position
        model.setTime(levelData["startHour"], levelData["startMinute"]);
        model.refreshViews();
    
        // set data according to level type
        var innerHTML = levelData["label"];
        if (levels[currentWorld]["type"] == "Zeit eingeben") {
          innerHTML = "<div>" + innerHTML + "</div><div><input id='edittime' type='time' value='00:00' onchange='model.setTimeFromText(this.value)'/></div>";
          //var timeControl = document.getElementById("edittime");
          //timeControl.addEventListener('change', model.setTimeFromText, false);
          }
        else if (levels[currentWorld]["type"] == "") {

          } 
        // set question
        questionControl.innerHTML = innerHTML;
        };  

    Game.prototype.init = function(_model) {
        console.log("Game::init()");
        model = _model;
        that = this;
        questionControl = document.getElementById("task");
        submitControl = document.getElementById("okButton");
        submitControl.addEventListener('click', levelCompleted, false);
        score = new LernDieUhr.Score;
        score.init(model);
        character = new LernDieUhr.Character;
        character.init(model);
        // register events for animations
        if (! model.initialized()) {
	  model.setValue("currentLevel", -1);
	  model.setValue("currentWorld", -1);
	  model.setValue("completedLevels", 0);
          // no need to ask for game restart, we are right at the beginning
	  hideDialog("ContinueGame");
          this.loadLevel();
	  }
        else {
          this.loadLevel(true);
        }
        };
    return Game;
})();
// end of MODULE
