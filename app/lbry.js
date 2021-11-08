/* eslint-disable no-undef */
let lbry_mails; // transactions information, claimID, ...
let channels_by_cid = {};

$("#lbry_compose_text #cancel_mail").on("click", function () 
{
	lbry_destroy_md();
});

$(document).on("submit", "#lbry_compose_text", function (event)
{
	const form = document.getElementById("lbry_compose_text");
	if (!form.checkValidity())
	{
		event.preventDefault();
		event.stopPropagation();
	}
	else
	{
		lbry_publish(event);
	}
	form.classList.add("was-validated");
});

async function lbrynet_status () 
{
	return await ipcRenderer.invoke("lbrynet_status");
}

async function lbry_init () 
{
	try 
	{
		let total_email_count = 0;
		const channels = await ipcRenderer.invoke("lbry_channels", ...[]);
		$("#message-list").empty();
		$("#channels").empty();
		channels_by_cid = {};
		lbry_mails = {};
		channels.forEach(async (channel, index) =>
		{
			channels_by_cid[ channel.claim_id ] = channel;
			$("#channels").prepend(lbry_channel_element(channel.name, channel.claim_id));

			const mails = await ipcRenderer.invoke("lbry_mails", channel.claim_id);
			mails.items.forEach((mail, index2) =>
			{
				
				mail.to = mail.value.tags[0];
				lbry_mails[ mail.claim_id ] = mail;
				total_email_count++;
				$("#message-list").prepend(lbry_mail_element(
					mail.signing_channel.name,
					mail.value.title,
					channels_by_cid[ mail.to ].name,
					`chk${index + index2 + 1}`,
					new Date(mail.timestamp * 1000).toLocaleString(),
					mail.claim_id
				));
				$("#inbox_messages_count").text(` (${total_email_count})`);
			});
		});
		enablePopover();
	}
	catch (error) 
	{
		console.log(error);
	}
}

function lbry_mail_click (item, target) 
{
	if (target.is("label")) 
	{
		item.toggleClass("selected");
	}
	else 
	{
		if (messageIsOpen && item.is(".active")) 
		{
			hideMessage();
			hideOverlay();
		}
		else 
		{
			if (messageIsOpen) 
			{
				hideMessage();
				item.addClass("active");
				setTimeout(function () 
				{
					lbry_mail_show(item);
				}, 300);
			}
			else 
			{
				item.addClass("active");
				lbry_mail_show(item);
			}
			showOverlay();
		}
	}
}

async function lbry_mail_show (item)
{
	const mai = lbry_mails[ $(item).attr("cid") ];
	const content = await ipcRenderer.invoke("lbry_content", mai);
	$("body").addClass("show-message");
	$("#message").empty();
	$("#message").prepend(lbry_message_element(
		mai.value.title,
		mai.signing_channel.name,
		channels_by_cid[ mai.to ].name,
		new Date(mai.timestamp * 1000).toLocaleString(),
		content
	));
	messageIsOpen = true;
}

function lbry_create_md () 
{
	lbry_destroy_md();
	simplemde = new SimpleMDE({
		element: $("#compose_text")[ 0 ],
		autofocus: true,
		placeholder: "Type here...",
		hideIcons: [ "guide", "fullscreen" ],
	});
	$("#lbry_compose_text").show();
	showOverlay();
}

function lbry_destroy_md () 
{
	let val;
	if (simplemde)
	{
		// console.log(simplemde.value());
		val = simplemde.toTextArea();
		simplemde = null;
	}
	$("#lbry_compose_text").hide();
	hideOverlay();
	return val;
}

async function lbry_publish (e) 
{
	const info = {
		content: {
			name: $("#mail_name").val(),
			title: $("#mail_title").val(),
			text: simplemde.value()
		},
		from:	{
			claim_id : $("#from_channel").val(),
			name: channels_by_cid[$("#from_channel").val()].name
		},
		to: $("#to_channel").val()
	};
	const result = await ipcRenderer.invoke("lbrynet_publish", info);
	if (result.error)
	{
		failMmodal(result.error.message);
	}
	else 
	{
		lbry_destroy_md();
	}
}


function lbry_channel_element (name, cid) 
{
	return `<li cid="${cid}" cname="${name}" data-bs-toggle="popover" title="Claim ID" data-bs-content="${cid}" ><a href="#">${name}<span class="ball blue"></span></a></li>`;
}

function lbry_message_element (cname, from, to, date, content) 
{
	return `
	<div class="header">
		<h1 class="page-title">
			<a id="backToPage">
				<span class="fa-stack" style="vertical-align: top;">
					<i class="far fa-circle fa-stack-2x" style="color:lightgray"></i>
					<i class="fas fa-arrow-left fa-stack-1x"></i>
				</span>
			</a>
			${cname}
		</h1>
		<p>From <a href="#">${from}</a> to <a href="#">${to}</a>, on <a href="#">${date}</a></p>
	</div>
	<div id="message-nano-wrapper" class="nano">
		<div class="nano-content">
			<ul class="message-container">
				<li class="sent">
					<div class="message">
						${content}
					</div>
				</li>
			</ul>
		</div>
	</div>`;
}

function lbry_mail_element (sender, title, cname, id, date, claim_id) 
{
	return `
	<li class="row unread" cid="${claim_id}">
		<div class="col">
			<div class="checkbox-wrapper">
				<input type="checkbox" id="${id}">
				<label for="${id}" class="toggle"></label>
			</div>
		</div>
		<div class="col-2 ml-2">
			<span class="title">${sender}</span>
		</div>
		<div class="col-4">
			<div class="subject">${title}</div>
		</div>
		<div class="col-3">
			<div class="channel_name">${cname}</div>
		</div>
		<div class="col-2">
			<div class="date">${date}</div>
		</div>
	</li>`;
}