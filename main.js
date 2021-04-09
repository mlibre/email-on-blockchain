const { app, BrowserWindow } = require("electron");
const path = require("path");
const {Menu} = require("electron");

// require("electron-reload")(__dirname);

Menu.setApplicationMenu(null);
function createWindow () 
{
	const win = new BrowserWindow({
		width: 800,
		height: 600,
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
	createWindow();

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
