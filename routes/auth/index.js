const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import joinOrLoginFacebook from '../../auth/facebook-auth.js';

// TODO: Remove and declare in app.js
require('dotenv').config();

// Configuration
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login/ Register login vía facebook\
router.post('/login', function (req, res, next) {
  const { tokenFB } = req.body;

  let payload = {
    tokenFB
  };

  const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// Find User via Facebook || Register if user doesn't exists in database
  const response = joinOrLoginFacebook(
    payload.tokenFB, ipUser);

  console.log(req.body, "req ====");

  payload.id = response;

  // Returned respones based on response value
  if (response) {
    const token = jwt.sign(payload, jwtOptions.secret);

    return res.status(200).json({
      token: response.id,
      status: true,
    });
  } else {
    return res.status(401).json({
      token: false,
      status: false,
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
