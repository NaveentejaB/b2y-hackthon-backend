const Joi = require("joi")

// auth validation
module.exports.sendOtp = (body) => {
    const schema = Joi.object({
        email : Joi.string().email().label('email').required(),
    })
    return schema.validate(body)
}

// for the users
module.exports.register = (body) => {
    const schema = Joi.object({
        name : Joi.string().min(3).label('name').required(),
        email : Joi.string().email().label('email').required(),
        phone : Joi.number().min(1000000000).max(9999999999).label('phone').required(),
        password : Joi.string().min(3).label("password").required(),
        otp :Joi.number().label('otp').required(), //keep check that he inputs 6 digits in frontend
    })
    return schema.validate(body)
}

// for the admins
module.exports.adminRegister = (body) => {
    const schema = Joi.object({
        name : Joi.string().min(3).label('name').required(),
        email : Joi.string().email().label('email').required(),
        password : Joi.string().min(3).label("password").required(),
        otp :Joi.number().label('otp').required(), //keep check that he inputs 6 digits in frontend
    })
    return schema.validate(body)
}


module.exports.login = (body) => {
    const schema = Joi.object({
        email : Joi.string().email().label('email').required(),
        password : Joi.string().min(3).label("password").required(),
    }).or('email','phone')
    return schema.validate(body)
}

// admin validation
module.exports.select = (body) => {
    const schema = Joi.object({
        userIds : Joi.array().min(1) //handling empty array in frontend
    })
    return schema.validate(body)
}

// user validation
module.exports.postIdea = (body) => {
    const schema = Joi.object({
        userRole : Joi.string().required(), //as user selects only options in frontend,
        idea : Joi.string().min(50).required(),
        phone : Joi.number().min(1000000000).max(9999999999).label('phone').required(),
        // pros:Joi.string().min(50).required(),
        // crons :Joi.string().min(50).required(),
    })
    return schema.validate(body)
}




