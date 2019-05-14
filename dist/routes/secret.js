'use strict';

var _secret = require('../models/secret');

var _secret2 = _interopRequireDefault(_secret);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var axios = require('axios');

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {

  var availableColours = ['#0000ff', '#ffa500', '#065535', '#ffc0cb', '#ff0000', '#003366', '#008080', '#8a2be2', '#666666', '#ff1493'];

  // console.log(req.user, "Holaaaa");
  var invalidDataReceived = {
    error: 'secret.publish.invalid'
  };

  console.log(req.body, "Req boyd");

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json(invalidDataReceived);
  }

  // TODO: Added into middleware to avoid boilerplate
  // const { location } = req.user.location;
  // const { longitude, latitude } = req.body;

  var _req$body = req.body,
      CountryCode = _req$body.CountryCode,
      Region = _req$body.Region,
      City = _req$body.City,
      longitude = _req$body.longitude,
      latitude = _req$body.latitude;


  var newSecret = new _secret2.default({
    author: req.user._id,
    content: req.body.content,
    backgroundColor: req.body.backgroundColor,
    location: {
      countryCode: CountryCode,
      regionName: Region,
      city: City,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      }
    }
  });

  newSecret.save(function (err) {
    if (err) {
      console.log(err, req.user);
      return res.status(403).json(invalidDataReceived);
    }

    return res.status(200).json({ success: true });
  });
});

router.post('/allByCity', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  var _req$body2 = req.body,
      Region = _req$body2.Region,
      City = _req$body2.City,
      latitude = _req$body2.latitude,
      longitude = _req$body2.longitude,
      CountryCode = _req$body2.CountryCode;


  console.log(req.body, req.params);

  var locationData = {
    countryCode: CountryCode,
    regionName: Region,
    city: City,
    location: {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)]
    }
  };

  // TODO: Using location to avoid make this request
  var updatedUser = await _user2.default.updateUserLocation(locationData, req.user._id);

  var secrets = await _secret2.default.getAllByCity(Number(longitude), Number(latitude));

  var userId = req.user._id;

  // Passing only how many likes|comments|shares it has
  secrets = secrets.map(function (secret) {
    var likes = secret.likes,
        comments = secret.comments,
        shares = secret.shares;


    var userLiked = secret.likes.find(function (like) {
      return '' + like.author == userId;
    });

    secret.userLiked = userLiked ? true : false;

    // Remove _id for security reasons
    delete secret._id;

    secret.likes = likes.length;
    secret.comments = comments.length;
    secret.shares = shares.length;

    return secret;
  });

  res.status(200).json({
    secrets: secrets
  });
});

router.post('/liked', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {
  var userData = req.user;
  var secretId = req.body.secretId;
  var author = userData._id;

  var secret = await _secret2.default.setLiked(secretId, author);
  // console.log(secret);

  var rest = secret[1];

  if (secret[0]) {
    res.status(200).json({
      success: true,
      rest: rest
    });
  } else {
    res.status(403).json({
      error: 'secret.error.setLike'
    });
  }
});

router.get('/:secretId', async function (req, res) {
  console.log(req.params, "Req");

  var secretId = req.params.secretId;


  var secret = await _secret2.default.findOne({ secretId: secretId }).select('content backgroundColor publishAt fontFamily comments.content comments.registerAt likes.author').lean().exec();

  // TODO: Use populate here instead of consult
  var comments = await _comment2.default.find({ secretId: secret._id }).lean().exec();

  if (!secret) {
    return res.status(404).json({
      success: false
    });
  }
  // Remove sensitive data and useless information
  delete secret._id;
  secret.likes = secret.likes.length;
  secret.commentsData = comments;
  secret.comments = comments.length;

  res.status(200).json({
    success: true,
    secret: secret
  });
});

module.exports = router;