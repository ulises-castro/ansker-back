'use strict';

var _secret = require('../models/secret');

var _secret2 = _interopRequireDefault(_secret);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

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

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json(invalidDataReceived);
  }

  // TODO: Added into middleware to avoid boilerplate
  // const { location } = req.user.location;
  var _req$body = req.body,
      longitude = _req$body.longitude,
      latitude = _req$body.latitude;

  // TODO: Modularize this into one file

  var geolocationUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?token=' + process.env.GEOLOCATION_TOKEN + '&f=pjson&featureTypes=&location=' + longitude + ',' + latitude;

  var geolocation = await axios.get(geolocationUrl);

  // console.log(geolocation, "Geolocaiton");

  var _geolocation$data$add = geolocation.data.address,
      CountryCode = _geolocation$data$add.CountryCode,
      Region = _geolocation$data$add.Region,
      City = _geolocation$data$add.City;


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

router.get('/allByCity', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  var _req$query = req.query,
      latitude = _req$query.latitude,
      longitude = _req$query.longitude;

  // TODO: Modularize this into one file

  var geolocationUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?token=' + process.env.GEOLOCATION_TOKEN + '&f=pjson&featureTypes=&location=' + longitude + ',' + latitude;

  var geolocation = await axios.get(geolocationUrl);

  console.log(geolocation, "Geolocaiton");

  var _geolocation$data$add2 = geolocation.data.address,
      Region = _geolocation$data$add2.Region,
      City = _geolocation$data$add2.City,
      CountryCode = _geolocation$data$add2.CountryCode;


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

  if (!secret) {
    return res.status(404).json({
      success: false
    });
  }
  // Remove sensitive data and useless information
  delete secret._id;
  secret.likes = secret.likes.length;
  secret.commentsData = secret.comments;
  secret.comments = secret.comments.length;

  res.status(200).json({
    success: true,
    secret: secret
  });
});

module.exports = router;