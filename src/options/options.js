/**
 * Performs Save action based on the setting values in the input fields
 * 
 * @param {Object} event  current event used to prevent form default
 */
function perform_save(event) {
	var unicornImg = document.getElementById('unicorn-img-setting').value;
	var addAction = document.getElementById('unicorn-add-setting').value;
	var clearAction = document.getElementById('unicorn-clear-setting').value;
	save_options(unicornImg, addAction, clearAction, displaySave);
	event.preventDefault();

}

/**
 * Peforms Reset action to restore the setting values to the default
 * 
 * @param {Object} event  current event used to prevent form default
 */
function perform_reset(event) {
	save_options('https://i.imgur.com/XeEii4X.png', 'u', 'c', function() {
		displaySave();
		document.getElementById('unicorn-img-setting').value = "https://i.imgur.com/XeEii4X.png";
		document.getElementById('unicorn-add-setting').value = 'u';
		document.getElementById('unicorn-clear-setting').value = 'c';
	});
	event.preventDefault();

}

/**
 * Syncs setting parameters into chrome storage and executes callback function
 * 
 * @param  {String} unicornImg  url to the unicorn image
 * @param  {String} addAction   keys pressed for add action
 * @param  {String} clearAction keys pressed for clear action
 * @param  {Function} callback function used after storing previous parameters in chrome storage
 */
function save_options(unicornImg, addAction, clearAction, callback) {
	chrome.storage.sync.set({
		unicornImage: unicornImg,
		unicornAdd: addAction,
		unicornClear: clearAction
	}, callback());

}

/**
 * Update status to let user know options were saved.
 */
function displaySave() {
	var status = document.getElementById('status');
	status.textContent = 'Options saved.';
	setTimeout(function() {
		status.textContent = '';
	}, 750);

}

/**
 * Restores settings using the preferences stored in chrome storage
 */
function restore_options() {
	chrome.storage.sync.get({
		unicornImage: 'https://i.imgur.com/XeEii4X.png',
		unicornAdd: 'u',
		unicornClear: 'c'
	}, function(settings) {
		document.getElementById('unicorn-img-setting').value = settings.unicornImage;
		document.getElementById('unicorn-add-setting').value = settings.unicornAdd;
		document.getElementById('unicorn-clear-setting').value = settings.unicornClear;
	});
}

/**
 * Populates an input field based on the current event and element id
 * 
 * @param  {Object} event       used to see which keys are pressed and to prevent default action for key
 * @param  {String} elementId   id of input element which will display to the user which keys have been pressed
 */
function populateKeysPressed(event, elementId) {
	var keysPressed = [];

	if (event.altKey) {
		keysPressed.push('alt');
	}

	if (event.ctrlKey) {
		keysPressed.push('ctrl');
	}

	if (event.metaKey) {
		keysPressed.push('meta');
	}

	if (event.shiftKey) {
		keysPressed.push('shift');
	}

	if (keysPressed.indexOf(event.key.toLowerCase()) === -1 && event.key.toLowerCase() !== 'control') {
		keysPressed.push(event.key.toLowerCase());
	}

	document.getElementById(elementId).value = keysPressed.join('+');
	event.preventDefault();

}

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('save').addEventListener('click', perform_save);

document.getElementById('reset').addEventListener('click', perform_reset);

document.getElementById('unicorn-add-setting').addEventListener('keydown', function(event) {
	populateKeysPressed(event, 'unicorn-add-setting');

});

document.getElementById('unicorn-clear-setting').addEventListener('keydown', function(event) {
	populateKeysPressed(event, 'unicorn-clear-setting');

});