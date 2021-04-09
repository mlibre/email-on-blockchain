const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const path = require("path");

// require("electron-reload")(__dirname);

// Menu.setApplicationMenu(null);

ipcMain.on("asynchronous-message", (event, arg) => 
{
	console.log(arg);

	// Event emitter for sending asynchronous messages
	event.sender.send("asynchronous-reply", "async pong");
});

// Event handler for synchronous incoming messages
ipcMain.on("synchronous-message", (event, arg) => 
{
	console.log(arg); 

	// Synchronous event emmision
	event.returnValue = "sync pong";
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
