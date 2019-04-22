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
router.post('/login', async function (req, res, next) {
  const { tokenFB } = req.body;

  let payload = {
    tokenFB
  };

  const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// Find User via Facebook || Register if user doesn't exists in database
  const response = await joinOrLoginFacebook(
    payload.tokenFB, ipUser);

  //Get last position
  // TODO: Get clear this code and break into chunks of code and files.
  console.log(response, "RESPONSEEEEEE");
  let lastLocation = response.ipLogs.length;
  // Find out how to get the lasted record
  lastLocation = (lastLocation) ? lastLocation - 1 : 0;
  // lastLocation = lastLocation[0];

  lastLocation = response.ipLogs[lastLocation].location;
  const {
    city,
    regionName,
    regionCode,
    countryCode
  } = lastLocation;

  const userLocation = {
    city,
    regionName,
    regionCode,
    countryCode,
  };

  const userData = {};
  userData.facebookId = response.authProviders.facebook.id;
  userData.id = `${response._id}`;
  // console.log(req.body, payload, "req ====");

  // Returned respones based on response value
  if (response && response !== null) {
    const token = jwt.sign(userData, jwtOptions.secret);

    return res.status(200).json({
      token: token,
      userLocation,
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
