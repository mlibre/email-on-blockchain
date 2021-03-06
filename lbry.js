const axios = require("axios");
const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const processExists = require("process-exists");
const { spawn } = require("child_process");
const random = require("random");
const { ipcMain } = require("electron");
var showdown  = require("showdown");
const methods = require("./lbry");

// IPCs

ipcMain.handle("lbrynet_status", async () => 
{
	const result = await processExists("lbrynet");
	if (!result)
	{
		return {
			error: true,
			message: "lbrynet is not running. Start the LBRY desktop application"
		}; 
	}
	const status = await methods.lbrynet_status();
	if (!status.startup_status.wallet || !status.startup_status.blob_manager)
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


// Methods
exports.lbrynet_status = async function () 
{
	const data = {
		method: "status",
		params: {}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

exports.lbrynet_start = async function () 
{
	const lbrynet = await processExists("lbrynet");
	if (!lbrynet)
	{
		const ls = spawn("lbrynet", ["start"]);
		ls.stdout.on("data", (data) => 
		{
			console.log(`stdout: ${data}`);
		});
	
		ls.stderr.on("data", (data) => 
		{
			console.error(`stderr: ${data}`);
		});
	
		ls.on("close", (code) => 
		{
			console.log(`child process exited with code ${code}`);
		});
	}
};

exports.wallet_list = async function () 
{
	const data = {
		method: "wallet_list",
		params: {}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result.items;
};

exports.wallet_status = async function (wid) 
{
	const data = {
		method: "wallet_status",
		params: {
			wallet_id: wid
		}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

exports.wallet_balance = async function (wid) 
{
	const data = {
		method: "wallet_balance",
		params: {
			wallet_id: wid
		}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

exports.accounts = async function accounts () 
{
	const data = {
		method: "account_list",
		params: {
			include_claims: true,
			show_seed: true,
		}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

exports.channels = async function channels () 
{
	try 
	{
		const data = {
			"method": "channel_list",
			"params": 
				{
					"name": [],
					"claim_id": [],
					"is_spent": false,
					"resolve": false,
					"no_totals": false
				}
		};
		const result = await axios.post(config.lbry.lbrynet , data);
		return result.data.result.items;
	}
	catch (error) 
	{
		throw new Error(error);
	}
};

exports.claim_list = async function claim_list () 
{
	const data = {
		"method": "claim_list", 
		"params": {
			"claim_type": [], 
			"claim_id": [], 
			"name": [], 
			"is_spent": false, 
			"channel_id": [], 
			"resolve": false, 
			"no_totals": false, 
			"include_received_tips": false
		}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

// exports.resolve = async function resolve(channelCID) 
// {
// 	const data = {
// 		"method":"resolve",
// 		"params":{
// 			"urls":[
// 				`mail-to-${channelCID}`
// 			],
// 			"include_purchase_receipt":false,
// 			"include_is_my_output":false,
// 			"include_sent_supports":false,
// 			"include_sent_tips":false,
// 			"include_received_tips":false
// 		}
// 	};
// 	const result = await axios.post(config.lbry.lbrynet , data);
// 	return result.data.result;
// };

exports.get_stream = async function get_stream (stream) 
{
	const download_dir_address = path.join(__dirname, config.lbry.inbox);
	// result = await axios.post(config.lbry.lbrynet , data);
	try 
	{
		const file_path = `${download_dir_address}${stream.name}-${stream.claim_id}.md`;
		fs.accessSync(file_path, fs.constants.R_OK | fs.constants.W_OK);
		return {download_path: file_path};
	}
	catch (error) 
	{
		console.log("Deleting" , error);
		const data_del = {
			"method": "file_delete",
			"params":
			{
				"claim_id": `${stream.claim_id}`,
			}
		};
		await axios.post(config.lbry.lbrynet , data_del);
		const data_get = {
			"method": "get",
			"params":
			{
				"uri": `${stream.permanent_url}`,
				"file_name": `${stream.name}-${stream.claim_id}.md`,
				"download_directory": download_dir_address
			}
		};
		const result = await axios.post(config.lbry.lbrynet , data_get);
		return result.data.result;
	}
};

// Fetch all the trasacntion with receiver channel id in its tag
exports.received_mails = async function received_mails (channelCID) 
{
	// https://open.lbry.com/@mlibre-mail-test:b/mail-to-e2b347558eec20aee84bf4657efa3832bb5a4ab9-0:4
	const data = {
		"method":"claim_search",
		"params":{
			// "text": `mail-to-${channelCID}-*`, old algorothm
			"claim_type": "stream",
			"claim_ids":[
				
			],
			"channel_ids":[
				
			],
			"not_channel_ids":[
				
			],
			"has_channel_signature":false,
			"valid_channel_signature":false,
			"invalid_channel_signature":false,
			"is_controlling":false,
			"stream_types":[
				
			],
			"media_types":[
				
			],
			"any_tags":[
				channelCID
			],
			"all_tags":[
				
			],
			"not_tags":[
				
			],
			"any_languages":[
				
			],
			"all_languages":[
				
			],
			"not_languages":[
				
			],
			"any_locations":[
				
			],
			"all_locations":[
				
			],
			"not_locations":[
				
			],
			"order_by":[
				"release_time"
			],
			"no_totals":true,
			"include_purchase_receipt":false,
			"include_is_my_output":false,
			"has_source":false,
			"has_no_source":false
		}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

exports.claim_info = async function claim_info (cid) 
{
	const data = {
		"method":"claim_search",
		"params":{
			"text": cid,
			"claim_type": "stream",
			"claim_ids":[
				// "4546164ed8b025adb6e6a37c92c7ebe937f3f8b4"
			],
			"channel_ids":[
				
			],
			"not_channel_ids":[
				
			],
			"has_channel_signature":false,
			"valid_channel_signature":false,
			"invalid_channel_signature":false,
			"is_controlling":false,
			"stream_types":[
				
			],
			"media_types":[
				
			],
			"any_tags":[
				
			],
			"all_tags":[
				
			],
			"not_tags":[
				
			],
			"any_languages":[
				
			],
			"all_languages":[
				
			],
			"not_languages":[
				
			],
			"any_locations":[
				
			],
			"all_locations":[
				
			],
			"not_locations":[
				
			],
			"order_by":[
				"release_time"
			],
			"no_totals":true,
			"include_purchase_receipt":false,
			"include_is_my_output":false,
			"has_source":false,
			"has_no_source":false
		}
	};
	const result = await axios.post(config.lbry.lbrynet , data);
	return result.data.result;
};

exports.publish = async function publish (content, fromCH, toCID) 
{
	const file_name = `mail-to-${toCID}-${random.int(100, 200)}`;
	const tmp_address = `${path.join(__dirname, config.lbry.tmp)}${file_name}.md`;
	fs.writeFileSync(tmp_address, content.text);
	
	const data = {
		"method": "publish",
		"params":
		{
			name: content.name,
			title: content.title,
			"bid": "0.1", 
			"file_path": tmp_address,
			"validate_file": false,
			"optimize_file": false,
			"tags": [
				toCID
			],
			"languages": [],
			"locations": [],
			"channel_account_id": [],
			"funding_account_ids": [],
			"channel_id": fromCH.claim_id,
			"channel_name": fromCH.name,
			"preview": false,
			"blocking": false
		}
	};
	try 
	{
		const result = await axios.post(config.lbry.lbrynet , data);
		return result.data;
	}
	catch (error) 
	{
		log(error);
	}
};