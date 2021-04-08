const axios = require("axios");
const config = require("./config.json");

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
	return result.data.result;
};

async function publish(params) 
{
	const data = "{\"method\": \"publish\", \"params\": {\"name\": \"a-new-stream\", \"bid\": \"1.0\", \"file_path\": \"/tmp/tmpbduedakt\", \"validate_file\": false, \"optimize_file\": false, \"tags\": [], \"languages\": [], \"locations\": [], \"channel_account_id\": [], \"funding_account_ids\": [], \"preview\": false, \"blocking\": false}}";
	await axios.post(config.lbrynet , );
}