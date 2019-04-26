'use strict';

var _secret = require('../models/secret');

var _secret2 = _interopRequireDefault(_secret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  var availableColours = ['#0000ff', '#ffa500', '#065535', '#ffc0cb', '#ff0000', '#003366', '#008080', '#8a2be2', '#666666', '#ff1493'];

  // console.log(req.user, "Holaaaa");
  var invalidDataReceived = {
    error: 'secret.publish.invalid'
  };

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json(invalidDataReceived);
  }

  // TODO: Added into middleware to avoid boilerplate
  var location = req.user.location;


  var newSecret = new _secret2.default({
    author: req.user._id,
    content: req.body.content,
    backgroundColor: req.body.backgroundColor,
    location: location
  });

  newSecret.save(function (err) {
    if (err) {
      console.log(err, req.user);
      return res.status(403).json(invalidDataReceived);
    }

    return res.status(200).json({ success: true });
  });
});

router.get('/allByCity', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {
  var _req$user$location = req.user.location,
      countryCode = _req$user$location.countryCode,
      regionCode = _req$user$location.regionCode,
      city = _req$user$location.city;


  var secrets = await _secret2.default.getAllByCity(countryCode, regionCode, city);

  // secrets.forEach(secret => {
  //   secret.howmuch = secret.likes.length;
  // });
  var response = secrets;
  for (var key in response) {
    response[key].how = 1;
  }

  res.status(200).json({
    secrets: secrets,
    response: response
  });
});

router.post('/liked', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {
  var userData = req.user;
  var secretId = req.body.secretId;
  var author = userData._id;

  var secret = await _secret2.default.setLiked(secretId, author);
  console.log(secret);

  if (secret) {
    res.status(200).json({
      success: true
    });
  } else {
    res.status(403).json({
      error: 'secret.error.setLike'
    });
  }
});

module.exports = router;