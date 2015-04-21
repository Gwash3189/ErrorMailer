require("./blanket.helper");
var rewire = require("rewire");
var expect = require("chai").expect;
var sinon = require("sinon");
var nodeMailerTransporterMock = {
	sendMail: undefined
};
var nodeMailerMock = {
	createTransport: undefined, 
	sendMail: undefined
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
var infoMock = {};
var errorMock = {};
var successMock;
var errorMock;
var mailerDataMock = {data: "OK"};
var mailerErrorMock;
var	mailer = rewire("./../mailer.js");


 


describe("Mailer", function() {
	beforeEach(function() {
		nodeMailerMock.sendMail = sinon.spy();
		nodeMailerMock.createTransport = sinon.stub().returns(nodeMailerTransporterMock);
	});
	beforeEach(function() {
		mailer.__set__("nodemailer", nodeMailerMock);
	});
	beforeEach(function() {
		mailerErrorMock = sinon.spy();
	});
	beforeEach(function() {
		nodeMailerTransporterMock.sendMail = sinon.spy();
	});
	beforeEach(function() {
		sinon.stub(mailer, "format");
	});
	afterEach(function(){
		mailer.format.restore();
	});

	describe("Send Mail", function() {
		it("should create a transporter with the service " + loginDetailsMock.service, function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerMock.createTransport.firstCall.args[0].service).to.equal(loginDetailsMock.service);
		});
		it("should create a transporter with the user " + loginDetailsMock.auth.user, function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerMock.createTransport.firstCall.args[0].auth.user).to.equal(loginDetailsMock.auth.user);
		});
		it("should create a transporter with the pass " + loginDetailsMock.auth.pass, function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerMock.createTransport.firstCall.args[0].auth.pass).to.equal(loginDetailsMock.auth.pass);
		});
		it("should call format", function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(mailer.format.called).to.be.true;
		});
		it("should call format wit the provded data", function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(mailer.format.firstCall.args[0]).to.deep.equal(mailerDataMock);
		});
	});

	describe("Transporter", function() {
		it("should send an email", function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerTransporterMock.sendMail.called).to.be.true;
		});
		it("should send mail to " + loginDetailsMock.to , function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerTransporterMock.sendMail.firstCall.args[0].to).to.equal(loginDetailsMock.to);
		});
		it("should send mail from " + loginDetailsMock.from , function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerTransporterMock.sendMail.firstCall.args[0].from).to.equal(loginDetailsMock.from);
		});
		it("should send mail with the subject '" + mailer.subject + "'" , function() {
			mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
			expect(nodeMailerTransporterMock.sendMail.firstCall.args[0].subject).to.equal(mailer.subject);
		});
		describe("Should call the success callback", function() {
			beforeEach(function() {
				nodeMailerTransporterMock.sendMail = function(){};
				sinon.stub(nodeMailerTransporterMock, "sendMail", function(m, mailHandler){
					mailHandler(undefined, infoMock);
				});
			});
			beforeEach(function() {
				successMock = sinon.spy(); 
			})
			it("when mail is sent", function() {
				mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
				expect(successMock.called).to.be.true;
			});
		});
		describe("Should call the error callback", function() {
			beforeEach(function() {
				nodeMailerTransporterMock.sendMail = function(){};
				sinon.stub(nodeMailerTransporterMock, "sendMail", function(m, mailHandler){
					mailHandler(errorMock);
				});
			});
			beforeEach(function(){
				errorMock = sinon.spy(); 
			})
			it("when mail is was not sent", function() {
				mailer.send(mailerDataMock, loginDetailsMock, errorMock, successMock);
				expect(errorMock.called).to.be.true;
			});
		});
	});
});