var nodemailer = require('nodemailer');

var mailer = {
	send: function(dataToSend, loginDetails, error, success) {
		var transporter = nodemailer.createTransport({
		    service: loginDetails.service,
		    auth: {
		        user: loginDetails.auth.user,
		        pass: loginDetails.auth.pass
		    }
		});
		var mailOptions = {
			to: loginDetails.to,
			from: loginDetails.from,
			subject: mailer.subject,
			text: mailer.format(dataToSend)
		};
		transporter.sendMail(mailOptions, mailer.sendMailHandler(error, success));
	},
	sendMailHandler: function(error, success) {
		return function(err, info){
			if(err){
				error(err);
			} else {
				success(info);
			}
		}
	},
	format: function(text) {
		return JSON.stringify(text, null, 4);
	},
	subject: "New error from error mailer"
};

module.exports = mailer;