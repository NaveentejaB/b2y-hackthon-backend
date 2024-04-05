const User = require('../models/userModel')

// to get all users
module.exports.getAllUsers = async(req,res) => {
    const users = await User.find({})
    return res.status(200).json({
        data : users,
        message : `all users fetched`,
        error : false
    })
}

// to get specific user
module.exports.getSpecificUser = async(req,res) => {
    const {id} = req.params
    const user = await User.findOne({_id:id})
    return res.status(200).json({
        message : `user details fetched.`,
        error : false
    })
}

// to select top user ideas and move them to final round
module.exports.selectUsersToFinal = async(req,res) => {
    const {userIds} = req.body
    const updateUsers = await User.updateMany({_id : { $in : userIds }} ,{
        $set:{isSelected : true}
    })
    return res.status(200).json({
        error : false,
        message : `users got selected.`
    })
}
