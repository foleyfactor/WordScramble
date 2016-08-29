// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice(parseInt(to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function indexify( string ) {
	var obj = {
		contains: function(substring) {
			return this[substring] != null;
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
					if (this[key][0] < min) {
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
		if (toArray.contains(from[i])) {
			map[i].push(from[i]);
			map[i].push(toArray.indexOf(from[i], true));

			fromArray.indexOf(from[i], true);
		}
	}

	for (var i=0; i<map.length; i++) {
		if (map[i].length == 0) {
			map[i].push(fromArray.getNext(true));
			map[i].push(toArray.indexOf(toArray.getNext(false), true));
		}
	}

	return map;
}

function createMovingList( parent, map ) {
	var movers = createBlankArray(map.length);

	for (var i=0; i<map.length; i++) {
		var $letter;
		if (map[i][0] !== ' ') {
			$letter = $('<div style="display: inline-block;">' + map[i][0] + '</div>');
		} else {
			$letter = $('<div style="display: inline-block;">&nbsp;</div>');
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
		currPos += movers[i][0].width();
	}

	var target = parent.text();
	var finalPos = 0;
	for (var i=0; i<target.length; i++) {
		for (var j=0; j<movers.length; j++) {
			if (map[j][1] == i) {
				movers[j][1] = finalPos - movers[j][1];
				finalPos += movers[j][0].width();
				break;
			}
		}
	}

	return movers;
}

$.fn.scramble = function( to, options ) {
	var settings = $.extend({
		yDuration: 400,
		xDuration: 700,
		infinite: false,
		unscramble: false,
		initialDelay: 0,
		finalDelay: 1000,
		wordList: [],
		wordIndex: 0
	}, options);

	var from = $(this).text();
	//console.log(to);
	$element = $(this);

	$element.text("");
	
	if (from.length != to.length) {
		//Effect will only work for same length phrases
		return;
	}

	var map = mapLetters(from, to);
	movers = createMovingList($element, map);

	var returned = false;

	for (var i=0; i<movers.length; i++) {
		movers[i][0].velocity({
			translateY: (movers[i][2] + "px")
		}, {duration: settings.yDuration, delay: settings.initialDelay})
		
		.velocity({
			translateX: (movers[i][1] + "px")
		}, {duration: settings.xDuration})

		.velocity({
			translateY: "0px"
		}, {duration: settings.yDuration,
			progress: function(elements, percentComplete, timeRemaining, timeStart) {
				if (percentComplete == 1 && !returned) {
					returned = true;
					$element.empty().text(to);
					setTimeout(function() {
						if (settings.unscramble) {
							return $element.scramble(from);
						} else if (settings.infinite) {
							return $element.scramble(from, {infinite: true});
						} else if (settings.wordList.length > 0) {
							var newIndex = (settings.wordIndex+1)%settings.wordList.length;
							return $element.scramble(settings.wordList[newIndex], {wordList: settings.wordList, wordIndex: newIndex})
						} else {
							return $element;
						}
					}, settings.finalDelay);
				}
			}
		});
	}	
}