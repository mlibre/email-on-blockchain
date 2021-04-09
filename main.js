const { app, BrowserWindow, screen, Menu } = require("electron");
const path = require("path");

// require("electron-reload")(__dirname);

Menu.setApplicationMenu(null);
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
			preload: path.join(__dirname, "preload.js")
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
