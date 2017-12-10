chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		/**
		 * Creates a unicorn image element and adds it into the unicorn container
		 * @return {Element} unicorn image element
		 */
		function createUnicorn() {
			var container = document.getElementById('unicorn-container');
			if (container === null) {
				var body = document.getElementsByTagName('body')[0];
				container = document.createElement('div');
				container.id = 'unicorn-container';
				body.append(container);
			}

			var unicorn = document.createElement('img');
			unicorn.classList = "unicorn-img";
			unicorn.src = "https://i.imgur.com/XeEii4X.png";
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
			var isUKey = (event.keyCode === 21 || event.charCode === 21);
			var isCKey = (event.keyCode === 99 || event.charCode === 99);

			if (isCKey === true) {
				// performs clear action by emptying unicorn container
				var container = document.getElementById('unicorn-container');
				container.innerHTML = '';

			} else if (event.ctrlKey === true && isUKey === true) {
				// adds a unicorn to the page and animates it
				var unicorn = createUnicorn();
				animate(unicorn);

			}
		}, false);
	}
	}, 10);
});