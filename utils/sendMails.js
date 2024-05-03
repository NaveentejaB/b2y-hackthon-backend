const mailSender = require('./mailSender')

module.exports.sendMailForIdea = async(email,idea) => {
    try {
		const mailResponse = await mailSender(
			email,
			"Idea Submission Confirmation",
			`<p>Dear User,</p>
            <p>Thank you for submitting your idea! We have received the following idea:</p>
            <blockquote>
                <p>${idea}</p>
            </blockquote>
            <p>We appreciate your contribution.</p>
            <p>Regards,<br/>Idea hub team</p>
            `
		);
		console.log("Email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}


module.exports.sendMailForTeam = async(compnayMail,user,idea) => {
    try {
		const mailResponse = await mailSender(
			compnayMail,
			"New Idea Submission from User",
			`<p>Hello,</p>
            <p>A new idea has been submitted by the following user:</p>
            <ul>
                <li><strong>Name:</strong> ${user.userName}</li>
                <li><strong>Email:</strong> ${user.userEmail}</li>
                <li><strong>Email:</strong> ${user.userPhone}</li>
            </ul>
            <p><strong>Idea:</strong></p>
            <blockquote>
                <p>${idea}</p>
            </blockquote>
            <p>Please review and take necessary action.</p>
            <p>Regards,<br/>Idea hub team</p>
            `
		);
		console.log("Email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

