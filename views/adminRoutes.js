const express = require('express')
const admin = require('../controllers/admin')
const {checkRole,authenticate} = require('../middleware/authenticate')

const adminRouter = express.Router()

adminRouter.get('/:id',authenticate(),checkRole('admin'),admin.getSpecificUser)

adminRouter.get('/',authenticate(),checkRole('admin'),admin.getAllUsers)

adminRouter.post('/select',authenticate(),checkRole('admin'),admin.selectUsersToFinal)

module.exports = adminRouter