class UnicornAnimator {
	constructor() {
		this.container = null;
		this.settings = {
			unicornImage: "https://i.imgur.com/XeEii4X.png",
			unicornAdd: "u",
			unicornClear: "c",
			unicornSpeed: 5,
			enableUnicorn: true,
		};

		this.init();
	}

	// Initialize the script: load settings and set up event listeners
	async init() {
		await this.loadSettings();
		this.createContainer();
		document.body.addEventListener("keydown", (event) => this.handleKeyPress(event));
	}

	// Retrieve settings from Chrome storage
	async loadSettings() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(this.settings, (storedSettings) => {
				this.settings = storedSettings;
				resolve();
			});
		});
	}

	// Creates a container for unicorns if it doesn't exist
	createContainer() {
		this.container = document.getElementById("unicorn-container");
		if (!this.container) {
			this.container = document.createElement("div");
			this.container.id = "unicorn-container";
			document.body.appendChild(this.container);
		}
	}

	// Handles keypress events for adding/removing unicorns
	handleKeyPress(event) {
		if (!this.settings.enableUnicorn) { 
			return;
		}

		if (this.matchKeys(this.settings.unicornClear, event)) {
			this.clearUnicorns();
		} else if (this.matchKeys(this.settings.unicornAdd, event)) {
			this.addUnicorn();
		}
	}

	// Compares expected key combination with the actual event keys
	matchKeys(expected, event) {
		const keysPressed = [];

		if (event.altKey) keysPressed.push("alt");
		if (event.ctrlKey) keysPressed.push("ctrl");
		if (event.metaKey) keysPressed.push("meta");
		if (event.shiftKey) keysPressed.push("shift");

		if (!keysPressed.includes(event.key.toLowerCase()) && event.key.toLowerCase() !== "control") {
			keysPressed.push(event.key.toLowerCase());
		}

		return expected === keysPressed.join("+");
	}

	// Adds a unicorn to the page and starts animation
	addUnicorn() {
		const unicorn = document.createElement("img");
		unicorn.classList.add("unicorn-img");
		unicorn.src = this.settings.unicornImage;
		unicorn.alt = "unicorn";
		unicorn.style.position = "absolute";
		unicorn.style.top = `${Math.random() * (window.innerHeight - 100)}px`; // Random vertical position
		unicorn.style.left = "-150px"; // Start off-screen
		unicorn.style.width = "100px";
		unicorn.style.height = "auto";

		this.container.appendChild(unicorn);
		this.animateUnicorn(unicorn);
	}

	// Animates the unicorn across the screen
	animateUnicorn(unicorn) {
		let pos = -150;
		const move = () => {
			if (pos >= window.innerWidth + 150) {
				unicorn.remove();
			} else {
				pos += (+this.settings.unicornSpeed); // Move speed
				unicorn.style.left = `${pos}px`;
				requestAnimationFrame(move);
			}
		};
		move();
	}

	// Clears all unicorns from the screen
	clearUnicorns() {
		this.container.innerHTML = "";
	}
}

new UnicornAnimator();
