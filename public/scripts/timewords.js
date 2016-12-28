// JS module pattern

// define NAMESPACE
var Format = window.Format || {};
Format.TimeWords = (function(){
    // private properties
    privateVariable = 4;
    var lowNames = ["null", "ein", "zwei", "drei", 
                  "vier", "fünf", "sechs", "sieben", "acht", "neun", 
                 "zehn", "elf", "zwölf", "dreizehn", "vierzehn", 
                  "fünfzehn", "sechzehn", "siebzehn", 
                  "achzehn", "neunzehn"];
    var tensNames = ["zwanzig", "dreißig", "vierzig", "fünfzig"];

    var quarters = ["viertel", "halb", "dreiviertel" ];

    // module properties
    var TimeWords = function(){
        return this;
    };

    // module methods
    TimeWords.prototype.getEnglishQuarters = function(hours, mins) {
        var result;
        var hour; 
        if (hours > 12) { // keine Stunden über 12
            hours -= 12
            }
        if (hours == 0) { // nicht viertel nach Null
            hours = 12
            }
	if (mins == 15) {
	    result = "viertel nach";
	}
	if (mins == 30) {
	    result = "halb";
            hours += 1;
	}
	if (mins == 45) {
	    result = "viertel vor";
            hours += 1;
	}
        hour = lowNames[hours];
        if (hours == 1) { // viertel nach eins
            hour = "eins";
            }
        if (result) {
            result = result + " " + hour + " ";
            }
        else {
            result = "" 
            }
        return result;
        }

    TimeWords.prototype.getQuarters = function(hours, mins) {
        var result;
        var hour; 
	if (mins == 15) {
	    result = "viertel";
	}
	if (mins == 30) {
	    result = "halb";
	}
	if (mins == 45) {
	    result = "dreiviertel";
	}
        if (hours > 12) {
            hours -= 12
            }
        hours += 1;
        hour = lowNames[hours];
        if (hours == 1) {
            hour = "eins";
            }
        if (result) {
            result = result + " " + hour + " ";
            }
        else {
            result = "" 
            }
        return result;
        }


    TimeWords.prototype.getHour = function(hours, mins) {
        var hour;
        hour = lowNames[hours];
        if (! hour) {
            tens = Math.floor(hours / 10);
            ones = hours % 10;
            if (tens <= 9) {
                hour = tensNames[tens - 2];
                if (ones > 0) {
                    hour = lowNames[ones] + "und" + hour;
                    }
            } else {
                result = "unknown"
            }
        }

        return hour;
        }

    TimeWords.prototype.getMinutes = function(hours, mins) {
        var result;
        if (mins < lowNames.length) {
            result = lowNames[mins];
        } else {
            tens = Math.floor(mins / 10);
            ones = mins % 10;
            if (tens <= 9) {
                result = tensNames[tens - 2];
                if (ones > 0) {
                    result = lowNames[ones] + "und" + result;
                    }
            } else {
                result = "unknown"
            }
        }
        if (mins == 1) {
            result = "eins";
            }
        return result;
        }

    TimeWords.prototype.getTime = function(hours, mins) {
        var tens, ones, result, hour;
        // get hour
        hour = this.getHour(hours, mins);
        // get minute
        min = this.getMinutes(hours, mins);
           
        if (mins > 0) {
           result = hour + " Uhr " + min;
           }
        else {
           result = hour + " Uhr";
           }
        return result;
        };
                
    return TimeWords;
})();
// end of TimeWords

// create instance
//var TimeWords = new Format.TimeWords();

