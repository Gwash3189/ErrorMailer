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
			subject: "New error from error mailer",
			text: JSON.stringify(dataToSend, null, 4)
		};
		transporter.sendMail(mailOptions, mailer.sendMailHandler);
	},
	sendMailHandler: function(err, info) {
		if(err){
			error(err);
		} else {
			success(info);
		}
	}
};

module.exports = mailer;