// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice(parseInt(to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

String.prototype.spaceCount = function(index) {
	var count = 0;
	for (var i=0; i<index; i++) {
		if (this[i] === ' ') {
			count++;
		}
	}
	return count;
}

function indexify( string ) {
	var obj = {
		contains: function(substring) {
			return (this[substring] != null && this[substring].length > 0);
		},
		indexOf: function(letter, del) {
			var temp = this[letter][0]+0;
			if (del) this[letter].remove(0);
			return temp;
		},
		getNext: function(del) {
			var min = Infinity;
			var minKey = '';
			for (key in this) {
				if (this[key].length > 0 && typeof(this[key]) !== 'function') {
					if (this[key][0] < min && key.trim().length > 0) {
						min = this[key][0];
						minKey = key;
					}
				}
			}
			if (del) this[minKey].remove(0);
			return minKey;
		}
	};
	for (var i=0; i<string.length; i++) {
		if (obj[string[i]] == null) {
			obj[string[i]] = [i];
		} else {
			obj[string[i]].push(i);
		}
	}

	return obj;
}

function createBlankArray( size ) {
	var arr = [];
	for (var i=0; i<size; i++) {
		arr.push([]);
	}
	return arr;
}

function mapLetters(from, to) {
	var fromArray = indexify(from);
	var toArray = indexify(to);

	map = createBlankArray(from.length);
	
	for (var i=0; i<from.length; i++) {
		if (from[i] === ' ') {
			map[i].push(' ');
			map[i].push(to.length+1);
			map[i].push(0);
		} else if (toArray.contains(from[i])) {
			map[i].push(from[i]);
			map[i].push(toArray.indexOf(from[i], true));
			map[i].push(to.spaceCount(map[i][1]));

			fromArray.indexOf(from[i], true);
		}
	}

	for (var i=0; i<map.length; i++) {
		if (map[i].length == 0) {
			map[i].push(fromArray.getNext(true));
			map[i].push(toArray.indexOf(toArray.getNext(false), true));
			map[i].push(to.spaceCount(map[i][1]));
		}
	}
	return map;
}

function getSpaceSize(element) {
	var test = $('<div style="visibility: hidden; display: inline-block">&nbsp;</div>');
	element.append(test);
	var width = test.width();
	test.remove();
	return width;
}

function createMovingList( parent, to, map ) {
	var movers = createBlankArray(map.length);

	for (var i=0; i<map.length; i++) {
		var $letter;
		if (map[i][0] !== ' ') {
			$letter = $('<div style="display: inline-block;">' + map[i][0] + '</div>');
		} else {
			$letter = $('<div class="anagram-space" style="display: inline-block;">&nbsp;</div>');
		}

		movers[i].push($letter);
		parent.append($letter);
	}

	var currPos = 0;
	for (var i=0; i<map.length; i++) {
		var yMove=movers[i][0].height()*0.75;
		if (map[i][1] == i) {
			yMove = 0;
		} else if (map[i][1] < i) {
			yMove *= -1;
		}
		movers[i].push(currPos);
		movers[i].push(yMove);
		if (movers[i][0].text().trim().length > 0) {
			currPos += movers[i][0].width();
		}
	}

	var target = to;
	var finalPos = 0;
	for (var i=0; i<target.length; i++) {
		for (var j=0; j<movers.length; j++) {
			if (map[j][1] == i) {
				movers[j][1] = finalPos - movers[j][1];
				if (movers[j][0].text().trim().length > 0) {
					finalPos += movers[j][0].width();
				}
				break;
			}
		}
	}

	return movers;
}

(function($) {
	$.fn.scramble = function( to, options ) {
		var settings = $.extend({
			yDuration: 400,
			xDuration: 700,
			infinite: false,
			unscramble: false,
			initialDelay: 0,
			finalDelay: 1000,
			wordList: [],
			wordIndex: -1,
			loopCount: 1
		}, options);

		var from = $(this).text().toUpperCase();
		to = to.toUpperCase();

		if (settings.wordList.length > 0 && settings.wordIndex == -1) {
			settings.wordList.push(from);
			settings.wordList.push(to);
		}

		$element = $(this);

		$element.text("");
		
		if (from.replace(/ /g, '').length != to.replace(/ /g, '').length) {
			//Effect will only work for phrases with the same number of non-whitespace
			//characters
			return;
		}

		var map = mapLetters(from, to);
		movers = createMovingList($element, to, map);

		var returned = false;

		var space = getSpaceSize($element);

		if ($('.anagram-space').length > 0) {

			$('.anagram-space').velocity({width: '0'}, {duration:300,
				progress: function(elements, percentComplete, timeRemaining, timeStart) {
					if (percentComplete === 1) {
						for (var i=0; i<movers.length; i++) {
							movers[i][0].velocity({
								translateY: (movers[i][2] + "px")
							}, {duration: settings.yDuration, delay: settings.initialDelay})
							
							.velocity({
								translateX: (movers[i][1] + "px")
							}, {duration: settings.xDuration})

							.velocity({
								translateY: "0px"
							}, {duration: settings.yDuration})

							.velocity({
								translateX: ((movers[i][1] + (space*map[i][2])) + "px")
							}, {duration: 300, 
								progress: function(elements, percentComplete, timeRemaining, timeStart) {
									if (percentComplete == 1 && !returned) {
											returned = true;
											$element.empty().text(to);
											setTimeout(function() { 
												if (settings.unscramble) {
													return $element.scramble(from);
												} else if (settings.infinite) {
													return $element.scramble(from, {infinite: true});
												} else if (settings.wordList.length > 0 && settings.wordIndex < settings.loopCount-2) {
													var newIndex = (settings.wordIndex+1)%settings.wordList.length;
													return $element.scramble(settings.wordList[newIndex], {wordList: settings.wordList, wordIndex: settings.wordIndex+1, loopCount: settings.loopCount});
												} else if (settings.loopCount > 1 && settings.wordIndex < settings.loopCount-2){
													return $element.scramble(from, {loopCount: settings.loopCount, wordIndex: settings.wordIndex+1});
												} else {
													return $element;
												}
												
											}, settings.finalDelay);
										}
									}
								}
							);
						}	
					}
				}
			});
		} else {
			for (var i=0; i<movers.length; i++) {
				movers[i][0].velocity({
					translateY: (movers[i][2] + "px")
				}, {duration: settings.yDuration, delay: settings.initialDelay})
				
				.velocity({
					translateX: (movers[i][1] + "px")
				}, {duration: settings.xDuration})

				.velocity({
					translateY: "0px"
				}, {duration: settings.yDuration})

				.velocity({
					translateX: ((movers[i][1] + (space*map[i][2])) + "px")
				}, {duration: 300, 
					progress: function(elements, percentComplete, timeRemaining, timeStart) {
						if (percentComplete == 1 && !returned) {
								returned = true;
								$element.empty().text(to);
								setTimeout(function() {
									if (settings.unscramble) {
										return $element.scramble(from);
									} else if (settings.infinite && settings.wordIndex < settings.loopCount-2) {
										return $element.scramble(from, {infinite: true, loopCount: settings.loopCount, wordIndex: settings.wordIndex+1});
									} else if (settings.wordList.length > 0 && settings.wordIndex < settings.loopCount) {
										var newIndex = (settings.wordIndex+1)%settings.wordList.length;
										return $element.scramble(settings.wordList[newIndex], {wordList: settings.wordList, wordIndex: settings.wordIndex+1, loopCount: settings.loopCount});
									} else if (settings.loopCount > 1 && settings.wordIndex < settings.loopCount-2){
										return $element.scramble(from, {loopCount: settings.loopCount, wordIndex: settings.wordIndex+1});
									} else {
										return $element;
									}
								}, settings.finalDelay);
							}
						}
					}
				);
			}
		}
	}
}(jQuery));