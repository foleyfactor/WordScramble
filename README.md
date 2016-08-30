# WordScramble
Word scrambling/unscrambling animation for JavaScript

Ever wanted to show off your inner linguist by having two anagrams shuffle, or having a meaningless string unscramble into a word? Now you can!

#Requirements
The WordScramble plugin requires both the [jQuery](https://jquery.com/) and [Velocity](https://github.com/julianshapiro/velocity) libraries.

#Usage
WordScramble can be used by calling the `scramble` function on a jQuery text object.

`$element.scramble(endString)`, where endString is the text that you would like to have the element transform into;

`$element.scramble(endString, {options})`, with the following options:
 - yDuration: the amount of time (ms) that the letters animate vertically for (each time). Default: 400.
 - xDuration: the amount of time (ms) that the letters animate horizontally. Default: 700.
 - loopCount: the number of times the animation should loop (back and forth unless a wordList is specified). Default 1.
 - infinite: shortcut for `loopCount: Infinity`. Default: false.
 - unscramble: whether or not the animation should perform the animation and then reverse it (shortcut for `loopCount: 2` Default: false.
 - initialDelay: the amount of time (ms) before the animation begins. Default: 0.
 - finalDelay: the amount of time (ms) after the animation ends and the next animation can proceed. Default: 1000.
 - wordList: an additional array of words that can be looped through infinitely. The initial value and the specified endString will also be included. Default: [].
 
#Suggestions/Comments
Have an idea and want to make WordScramble even better in the future? Let me know! Shoot me a message or submit a pull request!
