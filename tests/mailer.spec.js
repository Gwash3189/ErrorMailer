var rewire = require("rewire");
var assert = require("assert");
var sinon = require("sinon");

var nodeMailerTransporterMock = {
	sendMail: undefined
};
var nodeMailerMock = {
	createTransport: sinon.stub().returns(nodeMailerTransporterMock),
	sendMail: sinon.spy()
};
var loginDetailsMock = {
	"service": "Gmail",
	"auth" : {
        "user": "derp",
        "pass": "herp"
	},
	"from": "herp@herp.com",
	"to": "derp@derp.com"
};
var mailerDataMock = {data: "OK"};
var mailerErrorMock;
var mailer; 
describe("Mailer", function() {
	beforeEach(function() {
		mailer = rewire("./../mailer.js");
		mailer.__set__("nodemailer", nodeMailerMock);
	});
	beforeEach(function() {
		mailerErrorMock = sinon.spy();
	});
	beforeEach(function() {
		nodeMailerTransporterMock.sendMail = sinon.spy();
	});
	it("should send an email", function() {
		mailer.send(mailerDataMock, loginDetailsMock, function(){});
		assert(nodeMailerTransporterMock.sendMail.called);
	});
	it("should send mail to " + loginDetailsMock.to , function() {
		mailer.send(mailerDataMock, loginDetailsMock, function(){});
		assert(nodeMailerTransporterMock.sendMail.firstCall.args[0].to, loginDetailsMock.to);
	});
	it("should send mail from " + loginDetailsMock.from , function() {
		mailer.send(mailerDataMock, loginDetailsMock, function(){});
		assert(nodeMailerTransporterMock.sendMail.firstCall.args[0].from, loginDetailsMock.from);
	});
});