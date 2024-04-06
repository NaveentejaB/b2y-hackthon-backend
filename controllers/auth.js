const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { otpGen } = require('otp-gen-agent')
const validate = require('../utils/validationSchema')
const User = require("../models/userModel")
const OTP = require("../models/OTPModel")

// to send OTP for verification (resend OTP will be handled too)
module.exports.sendOTP = async(req,res) => {
    const { error } = validate.sendOtp(req.body);
    console.log(error);
    if (error)
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    const {email} = req.body
    const checkUserEmail = await User.findOne({userEmail:email})
    if(checkUserEmail){
        return res.status(400).json({
            message : `user email already registered.`,
            error : true
        })
    }
    const checkOtpAndEmail = await OTP.findOne({email:email})
    // if email is already have OTP. delete the old one and create new one
    if(checkOtpAndEmail){
        const deleteEmail = await OTP.findOneAndDelete({email:email})
    }
    const otp = await otpGen()
    const newEmailOtpPair = await new OTP({
        email : email,
        otp : otp
    }).save()
    return res.status(200).json({
        message : `OTP sent successfully.`,
        error : false
    })

}

// to register on successfull submission of correct OTP
module.exports.register = async(req,res) =>{
    const { error } = validate.register(req.body);
    console.log(error);
    if (error)
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    const {name,email,phone,password,otp} = req.body     
    const user = await User.findOne({$or:[{userEmail:email},{userPhone:phone}]})
    if(user){
        return res.status(400).json({
                message : `user email or phone number already registered.`,
                error : true    
            })
    }
    const checkOTP = await OTP.findOne({$and : [{email:email}, {otp:otp}]})
    if(!checkOTP){
        return res.status(400).json({
            message : `invalid OTP`,
            error : false
        })
    }  
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const role = "admin"
    await new User({
        userName : name,
        userEmail : email,
        userPhone : phone,
        userPassword : hashPassword,
        userRole : role
    }).save()

    const userData = await User.findOne({userEmail:email})
    
    const payload = { id:userData._id ,email:userData.userEmail ,role :"admin" }

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "60m" }
    )
    // user will be directed to the home page
    return res.status(201).json({
            message : `user registered successfully.`,
            accessToken : accessToken,
            error : false
        })
}

// login the user
module.exports.login = async(req,res) => {
    const { error } = validate.login(req.body);
    console.log(error);
    if (error)
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    const {email ,phone ,password} = req.body
    const user = await User.findOne({$and : {userEmail:email, userPhone:phone}})
    if(!user){
        return res.status(401).json({
            message : `user with email : ${email} does't exist.`,
            error : true
        })
    }
    const verifiedPassword = await bcrypt.compare(
        password,
        user.userPassword
    )
    if (!verifiedPassword)
        return res.status(401).json({
            error: true, 
            message: "Invalid  password" 
        })
    
    const payload = { id:user._id ,email:user.userEmail , role :"user"}

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "60m" }
    )	
    return res.status(200).json({
        accessToken : accessToken,
        error: false,
        message: "Logged in sucessfully",
    })
}