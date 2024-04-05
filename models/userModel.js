const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    userEmail : {
        type : String,
        unique : true,
        required : true
    },
    userPhone : {
        type : Number,
        unique : true,
        required : true,
        min: 1000000000, max : 9999999999
    },
    userPassword : {
        type : String,
        required : true
    },
    isSelected : {
        type : Boolean,
        default : false
    },
    userWork : {
        type : String,
        enum : ['student']
    },
    userIdea : { type : String },
    ideaPros : { type : String },
    ideaCrons : { type : String },
    ideaPPT : { type : String },
    rank : { type : Number }
})

const User = mongoose.model('User',userSchema)


module.exports = User