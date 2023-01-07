const { Titlebar } = require('custom-electron-titlebar');
const fs = require('fs');
const path = require('path');
const { enable, setFetchMethod, auto } = require('darkreader');
const RPC = require('./RPC.js');

class Main {
    constructor() {
        this.init();
    }
    
    init() {
        this.style = fs.readFileSync(path.resolve('static/style.css'));
        this.rpc = new RPC();
    }

    ready() {
        this.makeTitileBar();
        //this.initDarkMode();
        this.rpc.load();
    }

    makeTitileBar() {
        const titlebarOptions = {
            menu: null
        }
    
        new Titlebar(titlebarOptions);
    
        const titleEl = document.querySelector('.cet-window-title');
        const styleEl = document.createElement('style');
        
        titleEl.innerHTML = 'SoundCloud Desktop';
        styleEl.innerHTML = this.style;
        document.body.appendChild(styleEl);
    }

    initDarkMode() {
        setFetchMethod(window.fetch);
        auto();
    }
}

module.exports = Main;