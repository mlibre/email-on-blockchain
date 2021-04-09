const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const methods = require("./methods");
const path = require("path");

// require("electron-reload")(__dirname);

// Menu.setApplicationMenu(null);

ipcMain.handle("channels", async (event, ...args) => 
{
	const channels = await methods.channels();
	return channels;
	// 	const mails = await methods.received_mails(channel.claim_id);
});


ipcMain.handle("mails", async (event, cid) => 
{
	const mails = await methods.received_mails_2(cid);
	return mails;
});

 
function createWindow (width, height) 
{
	const win = new BrowserWindow({
		width,
		height,
		// frame: false,
		// transparent: true,
		// titleBarStyle: "hidden",
		// titleBarStyle: "hiddenInset",
		icon: `${__dirname}/ui/logo.png`,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
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
