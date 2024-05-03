const jwt = require('jsonwebtoken')
const validate = require('../utils/validationSchema')
const User = require('../models/userModel')
const mailer = require('../utils/sendMails')
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
    console.log(user);
    // sends mail to the user about the idea he submitted.
    await mailer.sendMailForIdea(user.userEmail,idea)
    // sends mail to company about new response.
    await mailer.sendMailForTeam("naveenteja1912@gmail.com",user,idea)

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
