const processExists = require("process-exists");

window.addEventListener("DOMContentLoaded", async () => 
{
	const lbrynet = await processExists("lbrynet");
	if(!lbrynet)
	{
		alert("lbrynet is not running");
	}
	// const replaceText = (selector, text) => 
	// {
	// 	const element = document.getElementById(selector);
	// 	if (element) element.innerText = text;
	// };
 
	// for (const type of ["chrome", "node", "electron"]) 
	// {
	// 	replaceText(`${type}-version`, process.versions[type]);
	// }
});