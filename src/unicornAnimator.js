class UnicornAnimator {
    _container;
    settings = {};
    keyPressEventReference;

    constructor() {
        this.container = null;
        this.settings = this.getDefaultSettings();
        this.initializeAnimator();
    }

    getDefaultSettings() {
        return {
            unicornImage: "https://i.imgur.com/XeEii4X.png",
            unicornAdd: "u",
            unicornClear: "c",
            unicornSpeed: 5,
            enableUnicorn: true,
        };
    }

    async initializeAnimator() {
        await this.loadSettings();
        this.reinitializeListener();
    }

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(this.settings, (storedSettings) => {
                this.settings = storedSettings;
                resolve();
            });
        });
    }

    handleKeyPress(event) {
        if (!this.settings.enableUnicorn) {
            return;
        } else if (this.matchKeys(this.settings.unicornClear, event)) {
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

        if (
            !keysPressed.includes(event.key.toLowerCase()) &&
            event.key.toLowerCase() !== "control"
        ) {
            keysPressed.push(event.key.toLowerCase());
        }

        return expected === keysPressed.join("+");
    }

    addUnicorn() {
        const unicorn = document.createElement("img");
        unicorn.classList.add("unicorn-img");
        unicorn.src = this.settings.unicornImage;
        unicorn.alt = "unicorn"; // Alt text
        unicorn.style.position = "absolute";
        unicorn.style.top = `${Math.random() * (window.innerHeight - 100)}px`; // Random vertical position
        unicorn.style.left = "-150px"; // Start off-screen
        unicorn.style.width = "100px";
        unicorn.style.height = "auto";

        document.body.appendChild(unicorn);
        this.animateUnicorn(unicorn);
    }

    animateUnicorn(unicorn) {
        let pos = -150;
        const move = () => {
            if (pos >= window.innerWidth + 150) {
                unicorn.remove();
            } else {
                pos += 5; // Move speed
                unicorn.style.left = `${pos}px`;
                requestAnimationFrame(move);
            }
        };
        move();
    }

    clearUnicorns() {
        this.container.innerHTML = "";
    }

    addEventListener() {
        this.keyPressEventReference = this.handleKeyPress.bind(this);
        document.body.addEventListener("keydown", this.keyPressEventReference);
    }

    removeEventListener() {
        if (this.keyPressEventReference) {
            document.body.removeEventListener(
                "keydown",
                this.keyPressEventReference,
            );
        }
    }

    reinitializeListener() {
        this.removeEventListener();
        this.addEventListener();
    }
}

export default UnicornAnimator;
