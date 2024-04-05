const Joi = require("joi")
// should be updated 
module.exports.register = (body) => {
    const schema = Joi.object({
        name :Joi.string().min(3).label('name').required(),
        address :Joi.string().min(10).label('address').required(),
        email : Joi.string().email().min(3).label('email').required(),
        password : Joi.string().min(3).label("password").required(),
        phone : Joi.number().min(1000000000).max(9999999999).label('phone').required()
    })
    return schema.validate(body)
}


module.exports.login = (body) => {
    const schema = Joi.object({
        email :Joi.string().email().label('email').required(),
        password : Joi.string().min(3).label("user_password").required(),
    })
    return schema.validate(body)
}

module.exports.update = (body) => {
    const schema = Joi.object({
        name :Joi.string().min(3).label('name'),
        address :Joi.string().min(10).label('address'),
        phone : Joi.number().min(1000000000).max(9999999999).label('phone'),
        photo : Joi.string().base64().label('photo'),
        proof : Joi.string().base64().label('proof')
    })
    return schema.validate(body)
}

module.exports.updateResult = (body) => {
    const schema = Joi.object({
        score : Joi.number().min(0).max(12).label('score').required(),
        status : Joi.boolean().label('status').required(),
        feedBack : Joi.number().min(0).max(2).label('feedBack').required()
    })
    return schema.validate(body)
}



