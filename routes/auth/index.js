const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import joinOrLoginFacebook from '../../auth/facebook-auth.js';

require('dotenv').config();

// Configuration
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login/ Register login vía facebook\
router.post('/login', function (req, res, next) {
  const { tokenFB } = req.body;

  const payload = {
    tokenFB
  };

  const ipUser =  req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const response = joinOrLoginFacebook(
    payload.tokenFB, ipUser);

  console.log(req.body, "req ====");

  if (response && response.length) {
    const token = jwt.sign(payload, jwtOptions.secret);

    return res.status(200).json({
      token: response.id
    });
  } else {
    return res.status(403).json({
      token: false,
      error: 'login.failed_token',
    });
  }

});

router.post('/secret', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  res.json({ message: "Successs!"});
});

module.exports = router;
