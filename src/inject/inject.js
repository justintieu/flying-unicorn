chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		function getSettings(callback) {
			return chrome.storage.sync.get({
				unicornImage: 'https://i.imgur.com/XeEii4X.png',
				unicornAdd: 'ctrl+u',
				unicornClear: 'c'
			}, function(settings) {
				callback(settings);

			});
		}

		function matchKeys(expected, actual) {
			var keysPressed = [];

			if (actual.altKey) {
				keysPressed.push('alt');
			}

			if (actual.ctrlKey) {
				keysPressed.push('ctrl');
			}

			if (actual.metaKey) {
				keysPressed.push('meta');
			}

			if (actual.shiftKey) {
				keysPressed.push('shift');
			}

			if (keysPressed.indexOf(actual.key.toLowerCase()) === -1 && actual.key.toLowerCase() !== 'control') {
				keysPressed.push(actual.key.toLowerCase());
			}

			return expected === keysPressed.join('+');

		}

		function createUnicornContainer() {
			var container = document.getElementById('unicorn-container');
			if (container === null) {
				var body = document.getElementsByTagName('body')[0];
				container = document.createElement('div');
				container.id = 'unicorn-container';
				body.append(container);
			}

			return container;
		}

		/**
		 * Creates a unicorn image element and adds it into the unicorn container
		 * @return {Element} unicorn image element
		 */
		function createUnicorn(container, unicornImage) {
			var unicorn = document.createElement('img');
			unicorn.classList = "unicorn-img";
			unicorn.src = unicornImage;
			unicorn.style.display = "block";
			container.append(unicorn);

			return unicorn;
		}

		/**
		 * Gives the illusion that a unicorn is animated by adjusting the position
		 * of the left style of a unicorn element.
		 * @param  {Element} unicorn element which will be moved from left to right
		 */
		function animate(unicorn) {
			var pos = "-150";
			var interval = setInterval(frame, 5);
			function frame() {
				if (pos == window.innerWidth + 150) {
					unicorn.remove();

				} else {
					pos++; 
					unicorn.style.left = pos + 'px'; 

				}
			}
		}

		var body = document.getElementsByTagName('body')[0];
		body.addEventListener("keypress", function(event) {
			getSettings(function(settings) {
				if (matchKeys(settings.unicornClear, event)) {
					// performs clear action by emptying unicorn container
					var container = document.getElementById('unicorn-container');
					container.innerHTML = '';

				} else if (matchKeys(settings.unicornAdd, event)) {
					var container = createUnicornContainer();
					// adds a unicorn to the page and animates it
					var unicorn = createUnicorn(container, settings.unicornImage);
					animate(unicorn);

				}
			});

		}, false);
	}
	}, 10);
});