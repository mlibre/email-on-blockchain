/* eslint-disable prefer-const */
const {ipcRenderer} = require("electron");
const SimpleMDE = require("simplemde");
$ = window.$ = window.jQuery = require("jquery");
require("@popperjs/core");
require("bootstrap");

var messageIsOpen = false;
let channels_by_cid = {};
let simplemde;

$(function($)
{
	$("#refresh").on("click" , function () 
	{
		let bc = active_blockchain();
		if(bc == "LBRY")
		{
			lbry_update();
		}
	});
	$("#compose").on("click", function () 
	{
		let bc = active_blockchain();
		if(bc == "LBRY")
		{
			create_md();
		}
	});
	$("#cancel_mail").on("click", function () 
	{
		let bc = active_blockchain();
		if(bc == "LBRY")
		{
			destroy_md();
		}
	});
	$("#send_mail").on("click", async function (e) 
	{
		let bc = active_blockchain();
		if(bc == "LBRY")
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
		}
	});
});

$("#blockchains li").on("click", async function(event) 
{
	let bc = $(this).attr("name");
	if(bc == "LBRY")
	{
		if(!await lbry_status())
		{
			failMmodal("lbrynet is not running. Start the LBRY desktop application");
			return;
		}
		await lbry_update();
	}
	$(this).addClass("bg-secondary");
});

$(document).on("click", "#main .message-list li", function(e) 
{
	let bc = active_blockchain();
	var item = $(this);
	var target = $(e.target);
	if(bc == "LBRY")
	{
		message_click(item , target);
	}
});

function showOverlay () 
{
	$("body").addClass("show-main-overlay");
}
function hideOverlay () 
{
	$("body").removeClass("show-main-overlay");
}
function hideMessage() 
{
	$("body").removeClass("show-message");
	$("#main .message-list li").removeClass("active");
	messageIsOpen = false;
}

$("#sidebar_bars").on("click", function() 
{
	$("body").addClass("show-sidebar");
	showOverlay();
});

function hideSidebar() 
{
	$("body").removeClass("show-sidebar");
}

$(document).on("click", "#backToPage", function() 
{
	hideMessage();
	hideOverlay();
});

$(document).on("click", "#main > .overlay", function() 
{
	hideOverlay();
	hideMessage();
	hideSidebar();
});

$(document).on("click", "input[type=checkbox]", function(e) 
{
	e.stopImmediatePropagation();
});

$(document).on("click", "a", function(e) 
{
	e.preventDefault();
});

function active_blockchain() 
{
	return $("#blockchains li[class=bg-secondary]").attr("name");
}