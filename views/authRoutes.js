const express = require('express')
const auth = require('../controllers/auth')

const authRouter = express.Router()

authRouter.post('/otp',auth.sendOTP)

authRouter.post('/register',auth.register)

authRouter.post('/login',auth.login)

module.exports = authRouter