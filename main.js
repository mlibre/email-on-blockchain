const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");
const mkdir = require("mkdirplz");
const config = require("./config.json");
const util = require("util");

require("electron-reload")(__dirname);
require("./lbry");

async function createWindow (width, height) 
{
	try 
	{
		await mkdir(path.join(__dirname, config.lbry.inbox));
		await mkdir(path.join(__dirname, config.lbry.tmp));
	}
	catch {}
	// Menu.setApplicationMenu(null);
	const win = new BrowserWindow({
		width,
		height,
		icon: path.join(__dirname, "/app/assets/logo.png"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			allowEval: false
		}
	});
	win.loadFile("./app/index.html");
}

app.whenReady().then(() => 
{
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	createWindow(width, height);

	app.on("activate", () => 
	{
		if (BrowserWindow.getAllWindows().length === 0) 
		{
			createWindow();
		}
	});
});

app.on("window-all-closed", () => 
{
	if (process.platform !== "darwin") 
	{
		app.quit();
	}
});

log = function (obj) 
{
	console.log(util.inspect(obj, false, null, true));
};