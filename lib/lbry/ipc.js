const { ipcMain } = require("electron");
const fs = require("fs");
const processExists = require("process-exists");
var showdown  = require("showdown");
const methods = require("./method");


ipcMain.handle("lbrynet_status", async () => 
{
	const result = await processExists("lbrynet");
	if(!result)
	{
		return {
			error: true,
			message: "lbrynet is not running. Start the LBRY desktop application"
		}; 
	}
	const status = await methods.lbrynet_status();
	if(!status.startup_status.wallet || !status.startup_status.blob_manager)
	{
		return {
			error: true,
			message: "lbrynet is still running try again in few second"
		};
	}
	return status.startup_status;
});

ipcMain.handle("lbry_channels", async () => 
{
	try 
	{
		const channels = await methods.channels();
		return channels;
		
	}
	catch (error) 
	{
		throw new Error(error);
	}
});

// fetch all the transaction with `mail-to-channelid` in their name. info like claimID
// fetch all the transactions with reciver's channel id in their tag
ipcMain.handle("lbry_mails", async (event, cid) => 
{
	const mails = await methods.received_mails(cid);
	return mails;
});

// fetch a claimID content
ipcMain.handle("lbry_content", async (event, mail) => 
{
	const result = await methods.get_stream(mail);
	const html = await fs.readFileSync(result.download_path, "utf8");
	var converter = new showdown.Converter();
	var text = html;
	return converter.makeHtml(text);
});

ipcMain.handle("lbrynet_start", async (event) => 
{
	const result = await methods.lbrynet_start();
	return result;
});

ipcMain.handle("lbrynet_publish", async (event, info) => 
{
	const result = await methods.publish(info.content, info.from, info.to);
	return result;
});