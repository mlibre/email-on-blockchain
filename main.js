const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
require("./ipcs");

require("electron-reload")(__dirname);

function createWindow (width, height) 
{
	try 
	{
		fs.mkdirSync("./space");
		fs.mkdirSync("./space/lbry");
	}
	catch {}
	// Menu.setApplicationMenu(null);
	const win = new BrowserWindow({
		width,
		height,
		icon: path.join(__dirname, "/ui/logo.png"),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			allowEval: false
		}
	});

	win.loadFile("./ui/index.html");
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
