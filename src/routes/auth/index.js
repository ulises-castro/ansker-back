const express = require('express')
const router = express.Router()

import { loginFacebook, loginGoogle, googleInfoByToken } from 'controllers/auth'

// Post login/ Register login vía facebook\
router.post('/facebook', loginFacebook)

// Get code
router.get('/google', loginGoogle)

// Get google user
router.get('/google/token', googleInfoByToken)

module.exports = router