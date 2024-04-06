const User = require('../models/userModel')
const validate = require('../utils/validationSchema')

// to get all users
module.exports.getAllUsers = async(req,res) => {
    const users = await User.find({})
    return res.status(200).json({
        data : users,
        message : `all users fetched`,
        error : false
    })
}

// get all selected users
module.exports.getFinalRoundUsers = async(req,res) => {
    const finalRoundUsers = await User.find({})
    return res.status(200).json({
        data : finalRoundUsers,
        message:`final round users fetched.`,
        error : false
    })
}

// to get specific user
module.exports.getSpecificUser = async(req,res) => {
    const {id} = req.params
    const user = await User.findOne({_id:id})
    return res.status(200).json({
        data : user,
        message : `user details fetched.`,
        error : false
    })
}

// to select top user ideas and move them to final round
module.exports.selectUsersToFinal = async(req,res) => {
    const { error } = validate.select(req.body);
    console.log(error);
    if (error)
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    const {userIds} = req.body
    const updateUsers = await User.updateMany({_id : { $in : userIds }} ,{
        $set:{isSelected : true}
    })
    return res.status(200).json({
        error : false,
        message : `users got selected.`
    })
}


