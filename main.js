const { app, BrowserWindow, screen, Menu, ipcMain } = require("electron");
const methods = require("./methods");
var showdown  = require("showdown");
const processExists = require("process-exists");
const path = require("path");
const fs = require("fs");

require("electron-reload")(__dirname);

ipcMain.handle("channels", async (event, ...args) => 
{
	const channels = await methods.channels();
	return channels;
	// 	const mails = await methods.received_mails(channel.claim_id);
});

ipcMain.handle("content", async (event, mail) => 
{
	const result = await methods.get_stream(mail);
	const html = await fs.readFileSync(result.download_path, "utf8");
	var converter = new showdown.Converter();
	var text = html;
	return converter.makeHtml(text);
});


ipcMain.handle("mails", async (event, cid) => 
{
	const mails = await methods.received_mails_2(cid);
	return mails;
});

ipcMain.handle("lbrynet", async (event) => 
{
	const lbrynet = await processExists("lbrynet");
	if(!lbrynet)
	{
		return false;
	}
	return true;
});


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
		// frame: false,
		// transparent: true,
		// titleBarStyle: "hidden",
		// titleBarStyle: "hiddenInset",
		icon: path.join(__dirname, "/ui/logo.png"),
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
