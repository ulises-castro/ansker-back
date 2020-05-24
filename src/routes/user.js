var express = require('express');
var router = express.Router();

import passport from 'passport'

import { sendContactMessage } from 'controllers/user'

router.post('/contact', passport.authenticate('jwt', {
  session: false,
}), sendContactMessage)

module.exports = router