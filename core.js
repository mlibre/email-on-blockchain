const util = require("util");
const methods = require("./methods");

(async () => 
{
	const wlist = await methods.wallet_list();

	wlist.forEach(async wid => 
	{
		// const wstatus = await methods.wallet_status(wid.id);
		// console.log(wstatus);

		// const wbalance = await methods.wallet_balance(wid.id);
		// console.log(wbalance);

		// const accounts = await methods.accounts();
		// console.log(accounts);

		const channels = await methods.channels();
		// console.log(channels);

		// channels.forEach(async channel => 
		// {
		// 	const mails = await methods.received_mails(channel.claim_id);
		// 	console.log(mails);
		// });

		const mails = await methods.received_mails_2();
		log(mails);
			
		
		// const claim_list = await methods.claim_list();
		// console.log(claim_list);

		
	});
})();