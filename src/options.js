import "./styles/options.css";

import Toast from "./toast";
import UnicornAnimator from "./unicornAnimator";

const animator = new UnicornAnimator();

const defaultSettings = {
    unicornImage: "https://i.imgur.com/XeEii4X.png",
    unicornAdd: "u",
    unicornClear: "c",
    unicornSpeed: 5,
    enableUnicorn: true,
};

document.addEventListener("DOMContentLoaded", () => {
    const unicornImage = document.getElementById("unicorn-img-setting");
    const unicornAdd = document.getElementById("unicorn-add-setting");
    const unicornClear = document.getElementById("unicorn-clear-setting");
    const unicornSpeed = document.getElementById("unicorn-speed-setting");
    const enableUnicorn = document.getElementById("enable-unicorn-setting");

    const resetButton = document.getElementById("resetSettings");
    const saveButton = document.getElementById("saveSettings");

    /**
     * Populates the keys pressed textbox with the key pressed
     * @param {*} event
     * @param {String} elementId
     */
    function populateKeysPressed(event, elementId) {
        event.preventDefault();
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
        document.getElementById(elementId).value = keysPressed.join("+");
    }

    unicornAdd.addEventListener("keydown", (event) =>
        populateKeysPressed(event, "unicorn-add-setting"),
    );
    unicornClear.addEventListener("keydown", (event) =>
        populateKeysPressed(event, "unicorn-clear-setting"),
    );

    function loadSettings() {
        // Load saved settings
        chrome.storage.sync.get(defaultSettings, (result) => {
            unicornImage.value = result.unicornImage;
            unicornAdd.value = result.unicornAdd;
            unicornClear.value = result.unicornClear;
            unicornSpeed.value = result.unicornSpeed;
            enableUnicorn.checked = result.enableUnicorn;
        });
    }

    /**
     * Validate required settings
     *
     * @param {Object} settings
     * @returns { isValid: boolean, errorMessage: string }
     */
    function areSettingsValid(settings) {
        let isValid = true;
        let errorMessage = "";

        if (!settings.unicornImage) {
            isValid = false;
            errorMessage = "Unicorn image is required.";
        }

        if (!settings.unicornSpeed) {
            isValid = false;
            errorMessage = "Unicorn speed is required.";
        }

        if (settings.unicornSpeed < 1 || settings.unicornSpeed > 20) {
            isValid = false;
            errorMessage = "Unicorn speed must be between 1 and 20.";
        }

        return { isValid, errorMessage };
    }

    // Save settings
    saveButton.addEventListener("click", () => {
        const settings = {
            unicornImage: unicornImage.value.trim(),
            unicornAdd: unicornAdd.value,
            unicornClear: unicornClear.value,
            unicornSpeed: unicornSpeed.value,
            enableUnicorn: enableUnicorn.checked,
        };

        const isValidResult = areSettingsValid(settings);
        if (isValidResult.isValid) {
            chrome.storage.sync.set(settings, () => {
                animator.initializeAnimator();
                Toast.show("Settings saved!");
            });
        } else {
            Toast.show(isValidResult.errorMessage, { type: "error" });
        }
    });

    // Reset settings
    resetButton.addEventListener("click", () => {
        chrome.storage.sync.set(defaultSettings, () => {
            loadSettings();
            Toast.show("Settings restored to defaults!");
        });
    });

    loadSettings();
});
