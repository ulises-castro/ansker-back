const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import getFacebookUser from '../../auth/facebook-auth.js';

require('dotenv').config();

// Configuration
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login
router.post('/login', function (req, res, next) {
  const { tokenFB } = req.body;

  const payload = {
    tokenFB
  };

  const response = getFacebookUser(payload.tokenFB);
  console.log(req.body, "req ====");

  if (response && response.length) {
    const token = jwt.sign(payload, jwtOptions.secret);

    return res.status(200).json({
      token: response.id
    });
  }

});

router.post('/secret', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  res.json({ message: "Successs!"});
});

module.exports = router;
