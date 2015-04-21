module.exports = require('blanket')({
	    pattern: function (filename) {
	        return !/node_modules/.test(filename) || !/tests/.test(filename);
	    }
	});
