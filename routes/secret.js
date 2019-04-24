const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import Secret from '../models/secret';

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),
function(req, res) {

  const availableColours = [
    '#0000ff', '#ffa500', '#065535',
    '#ffc0cb', '#ff0000', '#003366',
    '#008080', '#8a2be2', '#666666',
    '#ff1493'
  ];

  // console.log(req.user, "Holaaaa");
  const UserData = req.user;

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json({
      error: 'secret.publish.invalid'
    });
  }

  const lastLocation = (!UserData.ipLogs.length) ? 0 : UserData.ipLogs.length - 1;
  let location = UserData.ipLogs[lastLocation];
  const author = UserData._id;
  location = location.location;

  const newSecret = new Secret({
    author,
    content: res.content,
    backgroundColor: res.backgroundColor,
    location,
  });

  res.status(200).json({ message: '' });
});

module.exports = router;
