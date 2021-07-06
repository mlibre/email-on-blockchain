module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
	},
	"plugins": [
		"html"
	],
	"settings": {
		"html/xml-extensions": [".html", ".js"],  // consider .html files as XML
	},
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"rules": {
		"indent": ["error", "tab"],
	},
};
