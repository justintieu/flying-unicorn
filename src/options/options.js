// TODO. create a module for UnicornAnimator so it can be imported in here and for the inject.js
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

        this.init = this.init.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.createContainer();
		this.reinitializeListener();
    }

	addEventListener() {
		document.body.addEventListener("keydown", this.handleKeyPress);
	}

	removeEventListener() {
		document.body.removeEventListener("keydown", this.handleKeyPress);
	}

	reinitializeListener() {
		this.removeEventListener();
		this.addEventListener();
	}

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(this.settings, (storedSettings) => {
                this.settings = storedSettings;
                resolve();
            });
        });
    }

    createContainer() {
        this.container = document.getElementById("unicorn-container");
        if (!this.container) {
            this.container = document.createElement("div");
            this.container.id = "unicorn-container";
            document.body.appendChild(this.container);
        }
    }

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

    addUnicorn() {
        const unicorn = document.createElement("img");
        unicorn.classList.add("unicorn-img");
        unicorn.src = this.settings.unicornImage;
        unicorn.alt = "unicorn";
        unicorn.style.position = "absolute";
        unicorn.style.top = `${Math.random() * (window.innerHeight - 100)}px`;
        unicorn.style.left = "-150px";
        unicorn.style.width = "100px";
        unicorn.style.height = "auto";

        this.container.appendChild(unicorn);
        this.animateUnicorn(unicorn);
    }

    animateUnicorn(unicorn) {
        let pos = -150;
        const move = () => {
            if (pos >= window.innerWidth + 150) {
                unicorn.remove();
            } else {
                pos += (+this.settings.unicornSpeed);
                unicorn.style.left = `${pos}px`;
                requestAnimationFrame(move);
            }
        };
        move();
    }

    clearUnicorns() {
        this.container.innerHTML = "";
    }
}

class UnicornSettings {
    constructor() {
        this.defaultSettings = {
            unicornImage: "https://i.imgur.com/XeEii4X.png",
            unicornAdd: "u",
            unicornClear: "c",
            unicornSpeed: 5,
            enableUnicorn: true,
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.syncToChromeStorage = this.syncToChromeStorage.bind(this);
        this.afterSaveHandler = this.afterSaveHandler.bind(this);
        this.displaySave = this.displaySave.bind(this);
        this.restoreOptions = this.restoreOptions.bind(this);
        this.populateKeysPressed = this.populateKeysPressed.bind(this);

        document.addEventListener("DOMContentLoaded", this.restoreOptions);
        document.getElementById("save").addEventListener("click", this.handleSave);
        document.getElementById("reset").addEventListener("click", this.handleReset);
        document.getElementById("unicorn-add-setting").addEventListener("keydown", (event) => this.populateKeysPressed(event, "unicorn-add-setting"));
        document.getElementById("unicorn-clear-setting").addEventListener("keydown", (event) => this.populateKeysPressed(event, "unicorn-clear-setting"));

        this.unicornAnimator = new UnicornAnimator();
    }

    handleSave(event) {
        event.preventDefault();
        const unicornImage = document.getElementById("unicorn-img-setting").value.trim();
        const unicornAdd = document.getElementById("unicorn-add-setting").value.trim();
        const unicornClear = document.getElementById("unicorn-clear-setting").value.trim();
        let unicornSpeed = +document.getElementById("unicorn-speed-setting").value;
        const enableUnicorn = document.getElementById("enable-unicorn-setting").checked;

        if (!unicornImage || !unicornAdd || !unicornClear || isNaN(unicornSpeed)) {
            alert("All fields must be filled out.");
            return;
        }

        if (unicornSpeed <= 0 || unicornSpeed > 20) {
            alert("Unicorn speed must be between 1 and 20.");
            return;
        }

        this.syncToChromeStorage(
            {
                unicornImage,
                unicornAdd,
                unicornClear,
                unicornSpeed,
                enableUnicorn,
            },
            this.afterSaveHandler
        );
    }

    handleReset(event) {
        this.syncToChromeStorage(this.defaultSettings, () => {
            this.afterSaveHandler();
            this.restoreOptions();
        });
        event.preventDefault();
    }

    syncToChromeStorage(settings, callback) {
        chrome.storage.sync.set(settings, callback);
    }

    afterSaveHandler() {
        this.displaySave();
        this.unicornAnimator.init();
    }

    displaySave() {
        const status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(() => {
            status.textContent = "";
        }, 750);
    }

    restoreOptions() {
        chrome.storage.sync.get(this.defaultSettings, (settings) => {
            document.getElementById("unicorn-img-setting").value = settings.unicornImage;
            document.getElementById("unicorn-add-setting").value = settings.unicornAdd;
            document.getElementById("unicorn-clear-setting").value = settings.unicornClear;
            document.getElementById("unicorn-speed-setting").value = settings.unicornSpeed || 5;
            document.getElementById("enable-unicorn-setting").checked = settings.enableUnicorn;
        });
    }

    populateKeysPressed(event, elementId) {
        event.preventDefault();
        const keysPressed = [];
        if (event.altKey) keysPressed.push("alt");
        if (event.ctrlKey) keysPressed.push("ctrl");
        if (event.metaKey) keysPressed.push("meta");
        if (event.shiftKey) keysPressed.push("shift");
        if (!keysPressed.includes(event.key.toLowerCase()) && event.key.toLowerCase() !== "control") {
            keysPressed.push(event.key.toLowerCase());
        }
        document.getElementById(elementId).value = keysPressed.join("+");
    }
}

new UnicornSettings();
