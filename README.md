# Voice4Game.js Voice Command Library

This JavaScript library is meant to facilitate the control of web-based HTML5/JavaScript games through voice commands.

(More background information and in-depth documentation coming soon!)

# Usage Instructions
1. Include the voice4game.js library in your HTML5 project directory.

2. Add the following script tags before those of your JS game logic code in your main HTML file (often index.html):

          <script src=”PATH_TO_V4G”></script>

  * Replace PATH_TO_V4G with the relative path to the voice4game.js file from the directory of your main HTML file.
  * The voice4game.js file needs to be included before the game logic so that it may be initialized and configured within the game logic’s scope.

3. Call the Voice4Game.init function at the end of your initialization game logic so that it executes once and has access to game commands that you intend to map to voice commands.
  * Voice4Game.init’s first argument is an object whose key-value pairs are mappings of voice command text to game command functions (String -> Function), e.g.

          {“move left”: function() { player.moveLeft(); }, // ex. of mapping to an anonymous function
           “move right”: player.moveRight} // ex. of mapping to an existing function
           
    * (Note that proper creation of game command functions may require some experience in using closures in JavaScript to retain scope.)
  * Voice4Game.init’s second argument is a boolean value that enables “debug mode” if true, and leaves it off if false. 
    * “Debug mode” dynamically adds a transcription and logging text area to the top of your main HTML file so that spoken input and speech recognition statuses/errors may be displayed.

4. After your Voice4Game.init call, call the Voice4Game.start function wherever you want the speech recognition to begin listening (which is often right after the Voice4Game.init call).
  * OPTIONAL: If you would like to dynamically modify the mapping of voice commands to game command functions during your game’s runtime, you may use the Voice4Game.registerVoiceCmd and Voice4Game.unregisterVoiceCmd functions to add or remove mappings anytime after initialization. You may also call Voice4Game.stop at a point where you would like to stop speech recognition.

5. To test the usage of the newly integrated Voice4Game.js in your modified game, you must run it with a working internet connection in a browser that supports the Web Speech API, such as Google Chrome.
  * You can either deploy your modified game online (such as on a GitHub gh-pages page) or run it on a local HTTP web server serving to a port on your localhost.
  * If you host it online, make sure you visit your game’s page at its HTTPS URL. Otherwise, the browser will ask you for microphone permissions after every recognized portion of speech.
  * You must accept the requested microphone permissions in order for Voice4Game.js to work. You will see a red dot on your browser tab to indicate whether speech recognition is currently active.
  * Make sure to speak commands you included in the Voice4Game.js initialization clearly, and when contextually relevant within your game!
