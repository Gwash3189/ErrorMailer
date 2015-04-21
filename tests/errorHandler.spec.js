require("./blanket.helper");
var rewire = require("rewire");
var expect = require("chai").expect;
var sinon = require("sinon");
var errorHandler = rewire("./../errorHandler");

var outFile = "";
var logger = function(){};
var requestStub = {
	body: {
		error: "OK"
	}
};
var responseStrub = sinon.stub.returns({
	status: sinon.stub.returns(function() {
		return {
			json: sinon.stub()
		}
	})
});
var fs;

describe('Server Error Handler', function () {
	beforeEach(function(){
		fs = errorHandler.__get__("fs");
		sinon.stub(fs, "writeFile");
		errorHandler.__set__("fs", fs);
	});
	afterEach(function() {
		fs = errorHandler.__get__("fs");
		fs.writeFile.restore();
		errorHandler.__set__("fs", fs);
	});
	it('Should return a function', function () {
		expect(errorHandler()).to.be.a("function");
	});
	describe('Successful Request', function () {
		it('Should write to the provided file', function () {
			errorHandler(outFile, logger)(requestStub, responseStrub);
			expect(fs.writeFile.called).to.be.true;
		});
	});
});
