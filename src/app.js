const { app, BrowserWindow } = require("electron");
const path = require("path");

const { readFileSync, writeFileSync } = require("fs");
const fetch = require("cross-fetch");
const { ElectronBlocker, fullLists, Request } = require("@cliqz/adblocker-electron");

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

app.once("ready", async () => {

	app.mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		title: "SoundCloud Desktop",
		icon: path.join(__dirname + "./assets/logo.png"),
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			webSecurity: false,
			preload: path.join(__dirname, "preload.js")
		}
	});

	const blocker = await ElectronBlocker.fromLists(
		fetch,
		fullLists,
		{
			enableCompression: true,
		},
		{
			path: 'engine.bin',
			read: async (...args) => readFileSync(...args),
			write: async (...args) => writeFileSync(...args),
		},
	);
	blocker.enableBlockingInSession(app.mainWindow.webContents.session);

	app.mainWindow.loadURL("https://soundcloud.com");

	app.mainWindow.webContents.on("did-finish-load", () => {

		app.mainWindow.webContents.send("inject-darkreader", {
			inject: true
		});

		app.mainWindow.webContents.send("start-discord-rpc", {
			start: true
		});

	});

});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit()
});
