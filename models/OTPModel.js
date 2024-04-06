const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')

const otpSchema = new mongoose.Schema({
	email : { 
		type : String,
		required : true
	},
	otp : {
		type : String,
		required : true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 , // The document will be automatically deleted after 1 minute of its creation time
	},
})

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	// Send the email using our custom mailSender Function
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			`<h2>Please confirm your OTP : ${otp} </h2>
            `
		);
		console.log("Email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

otpSchema.pre("save", async function (next) {
	console.log("New document saved to database");
	
	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP
