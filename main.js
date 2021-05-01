const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");
const mkdir = require("mkdirplz");
const config = require("./config.json");

require("./ipcs");

require("electron-reload")(__dirname);

async function createWindow (width, height) 
{
	try 
	{
		await mkdir(`.${config.lbry.inbox}`);
		await mkdir(`.${config.lbry.sent}`);
	}
	catch {}
	// Menu.setApplicationMenu(null);
	const win = new BrowserWindow({
		width,
		height,
		icon: path.join(__dirname, "/assets/logo.png"),
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
