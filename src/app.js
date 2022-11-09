const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main');

let window = null;
setupTitlebar();

app.once('ready', () => {
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        icon: path.join(__dirname + './assets/logo.png'),
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    attachTitlebarToWindow(window);

    window.loadURL('https://soundcloud.com');

    window.once('ready-to-show', () => {
        window.maximize();
        window.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});