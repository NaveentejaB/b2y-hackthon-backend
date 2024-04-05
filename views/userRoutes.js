const express = require('express')
const user = require('../controllers/user')
const {checkRole,authenticate} = require('../middleware/authenticate')

const userRouter = express.Router()

userRouter.post('/',authenticate,checkRole('user'),user.postIdea)

userRouter.get('/',authenticate,checkRole('user'),user.getDetails)

userRouter.post('/pdf',authenticate,checkRole('user'),user.uploadPdf)

module.exports = userRouter

