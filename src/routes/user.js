var express = require('express');
var router = express.Router();

import passport from 'passport'

import { sendContactMessage, signupEmail } from 'controllers/user'

router.post('/signup', signupEmail)

router.post('/contact', passport.authenticate('jwt', {
  session: false,
}), sendContactMessage)

module.exports = router