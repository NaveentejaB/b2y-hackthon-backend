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
        required : true
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
        type : String
    },
    userRole : {
        typer : String,
    },
    userIdea : { type : String },
    ideaPros : { type : String },
    ideaCrons : { type : String }
})

const User = mongoose.model('User',userSchema)


module.exports = User