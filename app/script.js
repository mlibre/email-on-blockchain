/* eslint-disable no-undef */
/* eslint-disable prefer-const */

const { ipcRenderer } = require("electron");
const SimpleMDE = require("simplemde");
$ = window.$ = window.jQuery = require("jquery");
require("@popperjs/core");
let bootstrap = require("bootstrap");

var messageIsOpen = false;
let simplemde;

$(function ($)
{
	// Click on LBRY Blockchain
	$("#blockchains li[name=LBRY]").click();
});

$("#inboxElement").on("click", async function () 
{
	let bc = active_blockchain();
	if (bc == "LBRY")
	{
		await lbry_init();
	}
});

$("#compose").on("click", function () 
{
	let bc = active_blockchain();
	if (bc == "LBRY")
	{
		lbry_create_md();
	}
});

$("#blockchains li").on("click", async function (event) 
{
	let bc = $(this).attr("name");
	if (bc == "LBRY")
	{
		$("[rbc=LBRY]").show();
		let ls = await lbrynet_status();
		if (ls.error)
		{
			failMmodal(ls.message);
			return;
		}
		await lbry_init();
	}
	$(this).addClass("bg-secondary");
});

$(document).on("click", "#message-list li", function (e) 
{
	let bc = active_blockchain();
	var item = $(this);
	var target = $(e.target);
	if (bc == "LBRY")
	{
		lbry_mail_click(item, target);
	}
});

function showOverlay () 
{
	$("body").addClass("show-main-overlay");
}
function hideOverlay () 
{
	$("body").removeClass("show-main-overlay");
	let bc = active_blockchain();
	if (bc == "LBRY")
	{
		if (simplemde != null)
		{
			lbry_destroy_md();
		}
	}
}
function hideMessage () 
{
	$("body").removeClass("show-message");
	$("#message-list li").removeClass("active");
	messageIsOpen = false;
}

$("#sidebar_bars").on("click", function () 
{
	$("body").addClass("show-sidebar");
	showOverlay();
});

function hideSidebar () 
{
	$("body").removeClass("show-sidebar");
}

$(document).on("click", "#backToPage", function () 
{
	hideMessage();
	hideOverlay();
});

$(document).on("click", "#main > .overlay", function () 
{
	hideOverlay();
	hideMessage();
	hideSidebar();
});

$(document).on("click", "input[type=checkbox]", function (e) 
{
	e.stopImmediatePropagation();
});

$(document).on("click", "a", function (e) 
{
	e.preventDefault();
});

function enablePopover ()
{
	var popoverTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle=\"popover\"]"));
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl)
	{
		return new bootstrap.Popover(popoverTriggerEl);
	});
}

function active_blockchain () 
{
	return $("#blockchains li[class~=bg-secondary]").attr("name");
}


$("#MModal").on("hidden.bs.modal" , function ()
{
	$("#modal_message").text("");
	$("#mmodal_dot").css("animation","");
	$("#mmodal_dot").removeClass();
	$("#mmodal_dot").addClass("mmodal_dot");
	$(".mmodal_step").css("display","");
});

function successMmodal (text)
{
	$("#MModal").modal("show");
	$("#modal_message").text(text);
	$("#mmodal_dot").css("animation","none");
	$("#mmodal_dot").removeClass();
	$("#mmodal_dot").addClass("far fa-smile");
	$(".mmodal_step").css("display","none");
}
function failMmodal (text)
{
	$("#MModal").modal("show");
	$("#modal_message").text(text);
	$("#mmodal_dot").css("animation","none");
	$("#mmodal_dot").removeClass();
	$("#mmodal_dot").addClass("far fa-frown");
	$(".mmodal_step").css("display","none");	
}

function hideMmodalIn1d1S ()
{
	setTimeout(function ()
	{
		$("#MModal").modal("hide");
	}, 1100);
}