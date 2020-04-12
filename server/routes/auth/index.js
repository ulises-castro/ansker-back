const express = require('express')
const router = express.Router()

import { loginFacebook } from 'controllers/auth'

// Post login/ Register login vía facebook\
router.post('/facebook', loginFacebook)

// router.post('/google', Auth.loginGoogle)

export default router
