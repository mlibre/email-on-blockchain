const {ipcRenderer} = require("electron");
const SimpleMDE = require("simplemde");
window.$ = window.jQuery = require("jquery");

var cols = {};
var messageIsOpen = false;
let channels_by_cid = {};
const allMails = {};
let simplemde;

$(document).ready(async function($)
{
	const lbrynet = await ipcRenderer.invoke("lbrynet_status");
	if(!lbrynet)
	{
		alert("lbrynet is not running. Start the LBRY desktop application");
	}
	await update_lbry();
	$("#refresh").click(function () 
	{
		update_lbry();
	});
	$("#compose").click(function () 
	{
		create_md();
	});
	$("#cancel_mail").click(function () 
	{
		destroy_md();
	});
	$("#send_mail").click(async function (e) 
	{
		$(e).attr("cid");
		const info = {
			content: {
				title: "Title",
				text: simplemde.value()
			},
			from:	{
				claim_id : $("#from_channel").val(),
				name: channels_by_cid[$("#from_channel").val()].name
			},
			to: $("#to_claim").val()
		};
		const result = await ipcRenderer.invoke("lbrynet_publish", info);
		destroy_md();
	});
	cols.showOverlay = function() 
	{
		$("body").addClass("show-main-overlay");
	};
	cols.hideOverlay = function() 
	{
		$("body").removeClass("show-main-overlay");
	};
	cols.showMessage = async function(item) 
	{
		const mai = allMails[$(item).attr("cid")];
		const content = await ipcRenderer.invoke("lbry_content", mai);
		$("body").addClass("show-message");
		$("#message").empty();
		$("#message").prepend(message_element(
			mai.value.title,
			mai.signing_channel.name,
			channels_by_cid[mai.to].name,
			new Date(mai.timestamp*1000).toLocaleString(),
			content
		));
		messageIsOpen = true;
	};
	cols.hideMessage = function() 
	{
		$("body").removeClass("show-message");
		$("#main .message-list li").removeClass("active");
		messageIsOpen = false;
	};
	cols.showSidebar = function() 
	{
		$("body").addClass("show-sidebar");
	};
	cols.hideSidebar = function() 
	{
		$("body").removeClass("show-sidebar");
	};
	$(".search-box input").on("focus", function() 
	{
		if($(window).width() <= 1360) 
		{
			cols.hideMessage();
		}
	});
});

$(document).on("click", ".trigger-toggle-sidebar", function() 
{
	cols.showSidebar();
	cols.showOverlay();
});

$(document).on("click", ".trigger-message-close", function() 
{
	cols.hideMessage();
	cols.hideOverlay();
});

$(document).on("click", "#main .message-list li", function(e) 
{
	var item = $(this);
	var target = $(e.target);
	if(target.is("label")) 
	{
		item.toggleClass("selected");
	}
	else 
	{
		if(messageIsOpen && item.is(".active")) 
		{
			cols.hideMessage();
			cols.hideOverlay();
		}
		else 
		{
			if(messageIsOpen) 
			{
				cols.hideMessage();
				item.addClass("active");
				setTimeout(function() 
				{
					cols.showMessage(item);
				}, 300);
			}
			else 
			{
				item.addClass("active");
				cols.showMessage(item);
			}
			cols.showOverlay();
		}
	}
});

$(document).on("click", "#main > .overlay", function() 
{
	cols.hideOverlay();
	cols.hideMessage();
	cols.hideSidebar();
});

$(document).on("click", "input[type=checkbox]", function(e) 
{
	e.stopImmediatePropagation();
});

$(document).on("click", "a", function(e) 
{
	e.preventDefault();
});

function create_md() 
{
	destroy_md();
	simplemde = new SimpleMDE({
		element: $("#compose_text")[0],
		autofocus: true,
		placeholder: "Type here...",
		hideIcons: ["guide" , "fullscreen"],
	});
	$("#compose_text_wrapper").show();
	cols.showOverlay();
}

function destroy_md() 
{
	let val;
	if(simplemde)
	{
		console.log(simplemde.value());
		val = simplemde.toTextArea();
		simplemde = null;
	}
	$("#compose_text_wrapper").hide();
	cols.hideOverlay();
	return val;
}

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

function mail_element(sender, title, cname, id, date, claim_id) 
{
	return `
	<li class="row unread" cid="${claim_id}">
		<div class="">
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

function channel_element(name, cid) 
{
	return `<li cid="${cid}" cname="${name}"><a href="#">${name}<span class="ball blue"></span></a></li>`;
}

function message_element(cname, from, to, date, content) 
{
	return `<div class="header">
	  <h1 class="page-title"><a class="icon circle-icon glyphicon glyphicon-chevron-left trigger-message-close">
		 </a>${cname}<span class="grey"></span>
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
			  <div class="tool-box"><a href="#" class="circle-icon small glyphicon glyphicon-share-alt"></a><a href="#" class="circle-icon small red-hover glyphicon glyphicon-remove"></a><a href="#" class="circle-icon small red-hover glyphicon glyphicon-flag"></a></div>
			</li>
		 </ul>
	  </div>
	</div>`;
}