import express from 'express'
const passport = require("passport")
const router = express.Router()

import { registerDevice, registerDeviceUser } from 'controllers/device'

router.post('/register', registerDevice)

router.post('/register/user', passport.authenticate('jwt', {
  session: false,
}), registerDeviceUser)

module.exports = router