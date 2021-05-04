const { ipcMain } = require("electron");
const fs = require("fs");
const processExists = require("process-exists");
var showdown  = require("showdown");
const methods = require("./method");

ipcMain.handle("lbry_channels", async (event) => 
{
	const channels = await methods.channels();
	return channels;
});

ipcMain.handle("lbry_content", async (event, mail) => 
{
	const result = await methods.get_stream(mail);
	const html = await fs.readFileSync(result.download_path, "utf8");
	var converter = new showdown.Converter();
	var text = html;
	return converter.makeHtml(text);
});

ipcMain.handle("lbry_mails", async (event, cid) => 
{
	const mails = await methods.received_mails(cid);
	return mails;
});

ipcMain.handle("lbrynet_status", async (event) => 
{
	const result = await processExists("lbrynet");
	return result;
});

ipcMain.handle("lbrynet_start", async (event) => 
{
	const result = await methods.start_lbrynet();
	return result;
});

ipcMain.handle("lbrynet_publish", async (event, info) => 
{
	const result = await methods.publish(info.content, info.from, info.to);
	return result;
});