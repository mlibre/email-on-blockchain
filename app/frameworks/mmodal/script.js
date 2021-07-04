"use strict";

$("#MModal").on("hidden.bs.modal" , function()
{
	$("#modal_message").text("");
	$("#mmodal_dot").css("animation","");
	$("#mmodal_dot").removeClass();
	$("#mmodal_dot").addClass("mmodal_dot");
	$(".mmodal_step").css("display","");
});

function successMmodal(text)
{
	$("#MModal").modal("show");
	$("#modal_message").text(text);
	$("#mmodal_dot").css("animation","none");
	$("#mmodal_dot").removeClass();
	$("#mmodal_dot").addClass("far fa-smile");
	$(".mmodal_step").css("display","none");
}
function failMmodal(text)
{
	$("#MModal").modal("show");
	$("#modal_message").text(text);
	$("#mmodal_dot").css("animation","none");
	$("#mmodal_dot").removeClass();
	$("#mmodal_dot").addClass("far fa-frown");
	$(".mmodal_step").css("display","none");	
}

function hideMmodalIn1d1S()
{
	setTimeout(function ()
	{
		$("#MModal").modal("hide");
	}, 1100);
}