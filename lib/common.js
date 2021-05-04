const util = require("util");

log = function(obj) 
{
	console.log(util.inspect(obj, false, null, true /* enable colors */));
};