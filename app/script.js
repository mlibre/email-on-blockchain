const {ipcRenderer} = require("electron");
const SimpleMDE = require("simplemde");
$ = window.$ = window.jQuery = require("jquery");
require("@popperjs/core");
require("bootstrap");

var cols = {};
var messageIsOpen = false;
const channels_by_cid = {};
const allMails = {};
let simplemde;

$(async function($)
{

	$("#refresh").on("click" , function () 
	{
		update_lbry();
	});
	$("#compose").on("click", function () 
	{
		create_md();
	});
	$("#cancel_mail").on("click", function () 
	{
		destroy_md();
	});
	$("#send_mail").on("click", async function (e) 
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

$(document).on("click", "#backToPage", function() 
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


function mail_element(sender, title, cname, id, date, claim_id) 
{
	return `
	<li class="row unread" cid="${claim_id}">
		<div class="ml-2">
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