const jwt = require('jsonwebtoken')
const validate = require('../utils/validationSchema')
const User = require('../models/userModel')
const mailSender = require('../utils/mailSender')
const _ = require("lodash");

// to post an idea
module.exports.postIdea = async(req,res) => {
    const { error } = validate.postIdea(req.body);
    console.log(error);
    if (error)
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    const decoded = jwt.decode(req.headers["authorization"]).id.trim()
    const {phone,userRole,idea} = req.body
    const updateUser = await User.findByIdAndUpdate(decoded,{
        userWork : userRole,
        userIdea : idea,
        userPhone : phone
        // ideaPros : pros,
        // ideaCrons : crons
    })
    const user = await User.findById(decoded)

    await sendMailForIdea(user.userEmail,idea)
    
    return res.status(200).json({
        message : `user idea added.`,
        error : false
    })
}

// to get user details
module.exports.getDetails = async(req,res) => {
    const decoded = jwt.decode(req.headers["authorization"])
    const user = await User.findById(decoded.id.trim())
    if(!user)
        return res.status(400).json({
            message : `user with given user id not found.`,
            error : false
        })
    // to remove the sensitive data 
    const userDetails = _.omit(user.toObject(),['userPassword','_id'])

    return res.status(200).json({
        error : false,
        message : `user details fetched`,
        data : userDetails
    })
}


const sendMailForIdea = async(email,idea) => {
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
            <p>Regards,<br/>b2y team</p>
            `
		);
		console.log("Email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}