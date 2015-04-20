module.exports = { 
	noLoginFile: [
		"Please provide a login.js in this format.", 
		JSON.stringify(require("./login.js.template"), null, 4)
	],
	noPort: [
		"Please provide a port to listen on with the -p parameter."
	]
};