const jwt = require('jsonwebtoken')
const validate = require('../utils/validationSchema')
const User = require('../models/userModel')
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
    const {userRole,idea,pros,crons} = req.body
    const updateUser = await User.findByIdAndUpdate(decoded,{
        userWork : userRole,
        userIdea : idea,
        ideaPros : pros,
        ideaCrons : crons
    })
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
