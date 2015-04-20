var args = require('minimist')(process.argv.slice(2));
var express = require("express");
var bodyPraser = require("body-parser");
var app = express();
var fs = require("fs");
var chalk = require("chalk");
var errorMessages = require("./errorMessages.js");
var mailer = require("./mailer.js");
var outFileLocation = args.o || args.out;
var port = args.p || args.port; 
if(args.help) {
	success("EXAMPLE: errorMailer -p PORT -o OUTFILE -l LOGINDETAILS");
	success("login.js must be formatted as: \n" + JSON.stringify(require("./login.js.template"), null, 4))
	return 0;
}
var loginDetails = tryRequire(args.l || args.login, handleNoDetailsLocation);



if(canStartServer(port) && canWatchFile(outFileLocation)){
	watchFile(outFileLocation);
	startServer(port);
} else {
	return 1;
}


//watch out file for changes
//when changes happen, call mailer.js with new data;

function canWatchFile(outFileLocation){
	return fs.existsSync(outFileLocation)
}

function watchFile(outFileLocation) {
	fs.watchFile(outFileLocation, function(newFile, oldFile) {
		fs.readFile(outFileLocation, "utf8", function(err, content) {
			if(!err){
				mailer.send(JSON.stringify(content, null, 4), loginDetails, error);
			}
		})
	});
}

function startServer(port) {
	app.use(bodyPraser.json());
	app.post("/error", require("./errorHandler")(outFileLocation, error, success));
	app.listen(port);
	console.log(chalk.green("Listening on " + port));	
}

function error(message){
	console.log(chalk.red(message));
}

function success(message){
	console.log(chalk.green(message));
}

function canStartServer(port) {
	if(!!port){
		return true;
	} else{
		handleNoPort();
		return false;
	}
}

function handleNoDetailsLocation() {
	errorMessages.noLoginFile.map(error);
	throw new Error("unable to find login.js file");
}

function handleNoPort() {
	errorMessages.noPort.map(error);
	throw new Error("No Port provided");
}

function tryRequire(path, errhandler){
	try {
		return require(path);
	} catch(e){
		errhandler(e);
	}
}