const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// to post an idea
module.exports.postIdea = async(req,res) => {
    const decoded = jwt.decode(req.headers["authorization"])
    const {userRole,idea,pros,crons} = req.body
    const updateUser = await User.findByIdAndUpdate({decoded},{
        userWork : userRole,
        userIdea : idea,
        ideaPros : pros,
        ideaCrons : crons
    })
    return res.status(200).json({
        error : false,
        message : `user idea added.`
    })
}

// to get user details
module.exports.getDetails = async(req,res) => {
    const decoded = jwt.decode(req.headers["authorization"])
    const user = await User.findById(decoded)

    return res.status(200).json({
        error : false,
        message : `user details fetched`,
        data : user
    })
}

// to upload PPT as pdf
module.exports.uploadPdf = async(req,res) => {
    const decoded = jwt.decode(req.headers["authorization"])
    // handle uploading of ppt as pdf format
}