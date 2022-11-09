const { Titlebar, Color } = require("custom-electron-titlebar");
const fs = require("fs");
const path = require("path");
const { enable } = require('darkreader');

const style = fs.readFileSync(path.resolve('static/style.css'));

window.addEventListener('DOMContentLoaded', () => {
    const titlebarOptions = {
        menu: null
    }

    new Titlebar(titlebarOptions);

    const styleEl = document.createElement('style');
    styleEl.innerHTML = style;
    document.body.appendChild(styleEl);

    enable();
});