$("#blockchains li").on("click", async function(event) 
{
	const lbrynet = await ipcRenderer.invoke("lbrynet_status");
	if(!lbrynet)
	{
		failMmodal("lbrynet is not running. Start the LBRY desktop application");
		return;
	}

	await update_lbry();
	console.log($(this));
	// $(this).siblings().children().remove();
	// var a= $(this).siblings().toggle();
	// console.log( $(a).is(":visible"));
	// $(this).siblings().append("<img src=\"https://cdn4.iconfinder.com/data/icons/6x16-free-application-icons/16/Delete.png\" style=\"float:right; width:12px; height:12px;\">");
	// $(this).addClass('darr');
 
});

async function update_lbry() 
{
	try 
	{	
		let total_email_count = 0;
		const channels = await ipcRenderer.invoke("lbry_channels", ...[]);
		channels_by_cid = {};
		$("#message-list").empty();
		$("#channels").empty();
		channels.forEach(async (channel, index) =>
		{
			channels_by_cid[channel.claim_id] = channel;
			$("#channels").prepend(channel_element(channel.name , channel.claim_id));
	
			const mails = await ipcRenderer.invoke("lbry_mails", channel.claim_id);
			mails.items.forEach((mail,index2) =>
			{
				mail.to = mail.name.match(/mail-to-(.*)-\d/)[1];
				allMails[mail.claim_id] = mail;
				total_email_count++;
				$("#message-list").prepend(mail_element(
					mail.signing_channel.name,
					mail.value.title,
					channels_by_cid[mail.to].name,
					`chk${index + index2 + 1}`,
					new Date(mail.timestamp*1000).toLocaleString(),
					mail.claim_id
				));
				$("#inbox_messages_count").text(` (${total_email_count})`);
			});
		});
	}
	catch (error) 
	{
		console.log(error);
	}
}
