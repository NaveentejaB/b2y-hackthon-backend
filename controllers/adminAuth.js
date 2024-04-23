const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { otpGen } = require('otp-gen-agent')
const validate = require('../utils/validationSchema')
const Admin = require('../models/adminModel')
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
    const checkAdminEmail = await Admin.findOne({adminEmail:email})
    if(checkAdminEmail){
        return res.status(400).json({
            message : `admin email already registered.Try signing in.`,
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
    const { error } = validate.adminRegister(req.body);
    console.log(error);
    if (error)
        return res.status(400).json({ 
            error: true, 
            message: error.details[0].message
        })
    const {name,email,password,otp} = req.body     
    const admin = await Admin.findOne({adminEmail : email})
    if(admin){
        return res.status(400).json({
                message : `admin email already registered. Try signing in.`,
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

    await new Admin({
        adminEmail : email,
        adminName : name,
        adminPassword :hashPassword
    }).save()

    const adminData = await Admin.findOne({adminEmail : email})
    
    const payload = { id:adminData._id ,email:adminData.adminEmail ,role :"admin" }

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "120m" }
    )
    // user will be directed to the home page
    return res.status(201).json({
            message : `New admin registered successfully.`,
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
    const {email,password} = req.body
    const admin = await Admin.findOne({adminEmail : email})
    if(!admin){
        return res.status(401).json({
            message : `Admin with email : ${email} does't exist.`,
            error : true
        })
    }
    const verifiedPassword = await bcrypt.compare(
        password,
        admin.adminPassword
    )
    if (!verifiedPassword)
        return res.status(401).json({
            error: true, 
            message: "Invalid  password" 
        })
    
    const payload = { id:admin._id ,email:admin.adminEmail , role :"admin"}

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "120m" }
    )	
    return res.status(200).json({
        accessToken : accessToken,
        error: false,
        message: "Admin logged in sucessfully",
    })
}