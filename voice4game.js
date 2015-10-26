// Voice4Game Library
window.Voice4Game = (function() {
   var Voice4Game = {};

   /* 
   * Maps voice commands to corresponding functions
   * String -> Function
   */                            
   Voice4Game.textToFunc = {};
   
   /**
   * Initialize the Voice4Game library with a mapping of voice commands to
   * corresponding functions
   */
   Voice4Game.init = function(textToFuncMap) {
      Voice4Game.textToFunc = textToFuncMap;
   };
   
   /**
   * Register a voice command in mapping
   */
   Voice4Game.registerVoiceCmd = function(voiceCmd, cmdFunc) {
      Voice4Game.textToFunc[voiceCmd] = cmdFunc;
   };
   
   /**
   * Unregister a voice command from mapping
   */
   Voice4Game.unregisterVoiceCmd = function(voiceCmd) {
      delete Voice4Game.textToFunc[voiceCmd];
   };
   
   return Voice4Game;
}());

/*
* Mock functions for directional game movement
*/
function moveUp() {
   console.log("moving up");
}
function moveDown() {
   console.log("moving down");
}
function moveLeft() {
   console.log("moving left");
}
function moveRight() {
   console.log("moving right");
}

/*
* Mock initialization of Voice4Game
*/
Voice4Game.init({
   'up': moveUp,
   'down': moveDown,
   'left': moveLeft,
   'right': moveRight
});

// Test browser support
      window.SpeechRecognition = window.SpeechRecognition       ||
                                 window.webkitSpeechRecognition ||
                                 null;

	var stop = 0;

    if (window.SpeechRecognition === null) {
        document.getElementById('ws-unsupported').classList.remove('hidden');
        document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
        document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
    }
    else {
        var recognizer = new window.SpeechRecognition();
        var transcription = document.getElementById('transcription');
        var log = document.getElementById('log');
		var snd = new Audio("file.wav");

        recognizer.continuous = true;

        // Start recognising
        recognizer.onresult = function(event) {
        transcription.textContent = '';

            var result;
            for (var i = event.resultIndex; i < event.results.length; i++) {

                result = event.results[i][0].transcript;

                // Stops recognizing when "stop" is heard
                if (result.indexOf("stop") > -1 && stop == 0) {
                    recognizer.stop();
                    result = result.substring(0, result.indexOf("stop"));
                    log.innerHTML = 'Recognition stopped' + result + '<br />' + log.innerHTML;
                    stop = 1;
                }

                // Gets rid of weird extra whitespace.
                if (i > 0 && stop == 0) {
                  console.log("test\n");
                  result = result.substring(1);
                }

                // When result is finalized
                if (event.results[i].isFinal) {
                  transcription.textContent = result + ' (Confidence: ' + event.results[i][0].confidence + ')';

                    /* Voice commands for scrolling control
                       1. Scroll to bottom/top over a specified ms duration
                       2. Scroll down/up by a specified pixel offset */
                    if (result.indexOf("scroll down over") > -1) {
                        var durationMatches = result.match(/[0-9]+$/);
                        if (durationMatches.length > 0) {
                           var duration = parseInt(durationMatches[0]);
                           $('html, body').animate({
                             'scrollTop': $(document).height()
                           }, duration);
                        }
                    }
                    if (result.indexOf("scroll up over") > -1) {
                        var durationMatches = result.match(/[0-9]+$/);
                        if (durationMatches.length > 0) {
                           var duration = parseInt(durationMatches[0]);
                           $('html, body').animate({
                             'scrollTop': 0
                           }, duration);
                        }
                    }
                    if (result.indexOf("scroll down by") > -1) {
                        var offsetMatches = result.match(/[0-9]+$/);
                        if (offsetMatches.length > 0) {
                           var offset = parseInt(offsetMatches[0]);
                           $('html, body').animate({
                             'scrollTop': window.scrollY + offset
                           }, offset);
                        }
                    }
                    if (result.indexOf("scroll up by") > -1) {
                        var offsetMatches = result.match(/[0-9]+$/);
                        if (offsetMatches.length > 0) {
                           var offset = parseInt(offsetMatches[0]);
                           $('html, body').animate({
                             'scrollTop': window.scrollY - offset
                           }, offset);
                        }
                    }
                    
                    /*
                    * Check if result matches any registered Voice4Game commands
                    */
                    for (var voiceCmd in Voice4Game.textToFunc) {
                       if (result.indexOf(voiceCmd) > -1) {
                          Voice4Game.textToFunc[voiceCmd]();
                          break;
                       }
                    }
                }
                else if(stop == 0) {
                  transcription.textContent += result;
                }
            }
        };

        // Listen for errors
        recognizer.onerror = function(event) {
            log.innerHTML = 'Recognition error: ' + event.message + '<br />' + log.innerHTML;
        };

        window.onbeforeunload = function() {
            recognizer.abort();
            return "Please be sure you stopped recording.";
        }

        document.getElementById('button-play-ws').addEventListener('click', function() {
            // Set if we need interim results
            recognizer.interimResults = document.querySelector('input[name="recognition-type"][value="interim"]').checked;

            try {
                recognizer.start();
                // Play sound when started
                snd.play();
                stop = 0;
                log.innerHTML = 'Recognition started' + '<br />' + log.innerHTML;
            }
            catch(ex) {
                    log.innerHTML = 'Recognition error: ' + ex.message + '<br />' + log.innerHTML;
            }
        });

        document.getElementById('button-stop-ws').addEventListener('click', function() {
            recognizer.stop();
            log.innerHTML = 'Recognition stopped' + '<br />' + log.innerHTML;
        });

        document.getElementById('clear-all').addEventListener('click', function() {
          transcription.textContent = '';
          log.textContent = '';
        });
      }
