import "./styles/popup.css";

document.addEventListener("DOMContentLoaded", () => {
    const optionsNavigation = document.getElementById("options-link");
    const optionsFooter = document.querySelector('a[href="options.html"]');

    // Handle options navigation
    optionsNavigation.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });

    // Handle footer settings link
    optionsFooter.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });
});
