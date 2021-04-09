const axios = require("axios");
const config = require("./config.json");

log = function(obj) 
{
	console.log(util.inspect(obj, false, null, true /* enable colors */));
};

exports.wallet_list = async function() 
{
	const data = {
		method: "wallet_list",
		params: {}
	};
	const result = await axios.post(config.lbrynet , data);
	return result.data.result.items;
};

exports.wallet_status = async function(wid) 
{
	const data = {
		method: "wallet_status",
		params: {
			wallet_id: wid
		}
	};
	const result = await axios.post(config.lbrynet , data);
	return result.data.result;
};

exports.wallet_balance = async function(wid) 
{
	const data = {
		method: "wallet_balance",
		params: {
			wallet_id: wid
		}
	};
	const result = await axios.post(config.lbrynet , data);
	return result.data.result;
};

exports.accounts = async function accounts() 
{
	const data = {
		method: "account_list",
		params: {
			include_claims: true,
			show_seed: true,
		}
	};
	const result = await axios.post(config.lbrynet , data);
	return result.data.result;
};

exports.channels = async function channels() 
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
	const result = await axios.post(config.lbrynet , data);
	return result.data.result.items;
};

exports.claim_list = async function claim_list() 
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
	const result = await axios.post(config.lbrynet , data);
	return result.data.result;
};

exports.received_mails = async function received_mails(channelCID) 
{
	const data = {
		"method":"resolve",
		"params":{
			"urls":[
				`mail-to-${channelCID}`
			],
			"include_purchase_receipt":false,
			"include_is_my_output":false,
			"include_sent_supports":false,
			"include_sent_tips":false,
			"include_received_tips":false
		}
	};
	const result = await axios.post(config.lbrynet , data);
	return result.data.result;
};

exports.received_mails_2 = async function received_mails_2(channelCID) 
{
	// https://open.lbry.com/@mlibre-mail-test:b/mail-to-e2b347558eec20aee84bf4657efa3832bb5a4ab9-0:4
	const data = {
		"method":"claim_search",
		"params":{
			"text": `mail-to-${channelCID}-*`,
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
	const result = await axios.post(config.lbrynet , data);
	return result.data.result;
};

async function publish(params) 
{
	const data = "{\"method\": \"publish\", \"params\": {\"name\": \"a-new-stream\", \"bid\": \"1.0\", \"file_path\": \"/tmp/tmpbduedakt\", \"validate_file\": false, \"optimize_file\": false, \"tags\": [], \"languages\": [], \"locations\": [], \"channel_account_id\": [], \"funding_account_ids\": [], \"preview\": false, \"blocking\": false}}";
	await axios.post(config.lbrynet , );
}