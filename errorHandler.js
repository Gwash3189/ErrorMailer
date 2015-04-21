var fs = require("fs");
var state = {
	retryCounter: 0,
	incrementRetryCounter: function() {
		state.retryCounter = state.retryCounter + 1;
	},
	maxRetrys: 5
};

var handler = function errorRouteHandler(outFile, logger){
	return function innerHandler(request, response) {
		if(request.body.error){
			writeFile(outFile, request.body.error, handler.fileHandler(response));
		} else {
			response.status(500).json(request.body.error);
		}
		
	};
};
handler.fileHandler = function(response){
	 return function(err){
		if(err){
			response.status(500).json({error: err});
			logger(err);
		} else {
			response.status(200).json({data: "OK"});
		}
	};
};

module.exports = handler;

function writeFile(outFile, data, cb){
	fs.writeFile(outFile, data, handleError);
	function handleError(err){
		if(err && state.retryCounter < state.maxRetrys){
			state.incrementRetryCounter();
			writeFile(outFile, data, cb);
		} else {
			cb(err);
		}
	}
}