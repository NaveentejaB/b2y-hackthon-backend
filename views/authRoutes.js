const express = require('express')
const auth = require('../controllers/auth')
const adminAuth = require('../controllers/adminAuth')

const authRouter = express.Router()

// authentication for the users
authRouter.post('/otp',auth.sendOTP)

authRouter.post('/register',auth.register)

authRouter.post('/login',auth.login)

// authentication for the admins
authRouter.post('/admin/otp',adminAuth.sendOTP)

authRouter.post('/admin/register',adminAuth.register)

authRouter.post('/admin/login',adminAuth.login)

module.exports = authRouter