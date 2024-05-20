const express = require('express')
const auth = require('../controllers/auth')
const passport = require('passport')
const adminAuth = require('../controllers/adminAuth')

const authRouter = express.Router()

// authentication for the users
authRouter.post('/otp',auth.sendOTP)

authRouter.post('/register',auth.register)

authRouter.post('/login',auth.login)

authRouter.get("/login/success",auth.googleAuthSuccess)

authRouter.get("/login/failed",auth.googleAuthFailure)

authRouter.get("/google", passport.authenticate("google", ["profile", "email"]))

authRouter.get(
	"/google/callback",
	passport.authenticate("google", {
		// successRedirect: "/auth/login/success",
		successRedirect:process.env.CLIENT_URL_SUCCESS,
		failureRedirect: "/auth/login/failed",
	})
)

authRouter.get('/logout',auth.googleAuthLogout)

// authentication for the admins
authRouter.post('/admin/otp',adminAuth.sendOTP)

authRouter.post('/admin/register',adminAuth.register)

authRouter.post('/admin/login',adminAuth.login)

module.exports = authRouter