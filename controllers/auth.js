const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { otpGen } = require('otp-gen-agent')
const validate = require('../utils/validationSchema')
const User = require("../models/userModel")
const OTP = require("../models/OTPModel")
const passport = require("passport");

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
    // if email is already have OTP doc. delete the old one and create new one
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

    await new User({
        userName : name,
        userEmail : email,
        userPhone : phone,
        userPassword : hashPassword
    }).save()

    const userData = await User.findOne({userEmail:email})
    
    const payload = { id:userData._id ,email:userData.userEmail ,role :"user" }

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
    const {email,password} = req.body

    const user = await User.findOne({userEmail:email})
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


// google auth
module.exports.googleAuthSuccess = async(req,res) => {
	if (req.user) {
        console.log(req.user.emails[0].value);
        const user = await User.find({userEmail:req.user.emails[0].value})
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.user.displayName, salt)

        if(user.length === 0){
            console.log("new user");
            const data = await new User({
                userName : req.user.displayName,
                userEmail : req.user.emails[0].value,
                userPhone : 0,
                userPassword : hashPassword
            }).save()
        }
        
        const userData = await User.find({userEmail:req.user.emails[0].value})
        const payload = { id:userData._id ,email:userData.userEmail , role :"user"}

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "60m" }
        )	

		return res.status(200).json({
			error: false,
            accessToken : accessToken,
			message: "Successfully Loged In"
		});
	} else {
		return res.status(403).json({ error: true, message: "Not Authorized" });
	}
}

module.exports.googleAuthFailure = async(req, res) => {
	return res.status(401).json({
		error: true,
		message: "Log in failure",
	});
}

module.exports.googleAuthLogout = async(req, res) => {
	req.logout();
	return res.status(200).json({
        error : false,
        message : 'successfully logged out.'
    })
}