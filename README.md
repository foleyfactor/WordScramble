# WordScramble
Word (anagram) scrambling/unscrambling animation for JavaScript

Ever wanted to show off your inner linguist by having two anagrams shuffle? Now you can!

#Requirements
The WordScramble plugin requires both the [jQuery](https://jquery.com/) and [Velocity](https://github.com/julianshapiro/velocity) libraries.

#Usage
WordScramble can be used by calling the `scramble` function on a jQuery text object.

`$element.scramble(endString)`, where endString is the text that you would like to have the element transform into;

`$element.scramble(endString, {options})`, with the following options:
 - yDuration: the amount of time (ms) that the letters animate vertically for (each time). Default: 400.
 - xDuration: the amount of time (ms) that the letters animate horizontally. Default: 700.
 - infinite: whether or not the animation should loop forever. Default: false.
 - unscramble: whether or not the animation should scramble, and then reverse the animation. Default: false.
 - initialDelay: the amount of time (ms) before the animation begins. Default: 0.
 - finalDelay: the amount of time (ms) after the animation ends and the animation can proceed. Default: 1000.
 - wordList: an array of words that can be looped through infinitely. Default: [].
 - wordIndex: the index in the wordList that the animation should start with. Default: 0.
 
#Suggestions/Comments
Have an idea and want to make WordScramble even better in the future? Let me know! Shoot me a message or submit a pull request!
