"use strict";

var _secret = _interopRequireDefault(require("../models/secret"));

var _user = _interopRequireDefault(require("../models/user"));

var _comment = _interopRequireDefault(require("../models/comment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var passport = require('passport');

var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var axios = require('axios');

;
router.post('/publish', passport.authenticate('jwt', {
  session: false
}), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    var availableColours = ['#0000ff', '#ffa500', '#065535', '#ffc0cb', '#ff0000', '#003366', '#008080', '#8a2be2', '#666666', '#ff1493']; // console.log(req.user, "Holaaaa");

    var invalidDataReceived = {
      error: 'secret.publish.invalid'
    };
    console.log(req.body, "Req boyd"); // Sended an invalid color, received an no-valid color

    if (availableColours.indexOf(req.body.backgroundColor) === -1) {
      res.status(403).json(invalidDataReceived);
    } // TODO: Added into middleware to avoid boilerplate
    // const { location } = req.user.location;
    // const { longitude, latitude } = req.body;


    var {
      CountryCode,
      Region,
      City,
      longitude,
      latitude
    } = req.body;
    var newSecret = new _secret.default({
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

      return res.status(200).json({
        success: true
      });
    });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/allByNearDistance', passport.authenticate('jwt', {
  session: false
}), /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    var {
      Region,
      City,
      latitude,
      longitude,
      CountryCode
    } = req.body;
    console.log(req.body, req.params);
    var locationData = {
      countryCode: CountryCode,
      regionName: Region,
      city: City,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      }
    }; // TODO: Using location to avoid make this request

    var updatedUser = yield _user.default.updateUserLocation(locationData, req.user._id);
    var secrets = yield _secret.default.getAllByCity(Number(longitude), Number(latitude));
    var userId = req.user._id; // Passing only how many likes|comments|shares it has

    secrets = secrets.map(secret => {
      var {
        likes,
        comments,
        shares
      } = secret;
      var userLiked = secret.likes.find(like => "".concat(like.author) == userId);
      secret.userLiked = userLiked ? true : false; // Remove _id for security reasons

      delete secret._id;
      secret.likes = likes.length;
      secret.comments = comments.length;
      secret.shares = shares.length;
      return secret;
    });
    res.status(200).json({
      secrets
    });
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/allByCity', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (req, res) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); // const {
    //   Region,
    //   City,
    //   latitude,
    //   longitude,
    //   CountryCode,
    // } = req.body;

    console.log(req.body, req.params);
    var countryCode = 'MX';
    var city = 'Guadalajara';
    var secrets = yield _secret.default.getAllByCity(countryCode, city); // console.log(secrets, "Secrets");
    // Passing only how many likes|comments|shares it has

    secrets = secrets.map(secret => {
      var {
        likes,
        comments,
        shares
      } = secret;

      if (req.user) {
        var userId = req.user._id;
        var userLiked = secret.likes.find(like => "".concat(like.author) == userId); // Set user as liked 

        secret.userLiked = userLiked ? true : false;
      } // Remove _id for security reasons


      delete secret._id;
      secret.likes = likes.length;
      secret.comments = comments.length;
      secret.shares = shares.length;
      return secret;
    });
    res.status(200).json({
      secrets
    });
  });

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/liked', passport.authenticate('jwt', {
  session: false
}), /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (req, res) {
    var userData = req.user;
    var secretId = req.body.secretId;
    var author = userData._id;
    var secret = yield _secret.default.setLiked(secretId, author); // console.log(secret);

    var rest = secret[1];

    if (secret[0]) {
      res.status(200).json({
        success: true,
        rest
      });
    } else {
      res.status(403).json({
        error: 'secret.error.setLike'
      });
    }
  });

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.get('/:secretId', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(function* (req, res) {
    console.log(req.params, "Req");
    var {
      secretId
    } = req.params;
    var secret = yield _secret.default.findOne({
      secretId
    }).select('content backgroundColor publishAt fontFamily comments.content comments.registerAt likes.author').lean().exec(); // TODO: Use populate here instead of consult

    var comments = yield _comment.default.find({
      secretId: secret._id
    }).select('content publishAt -_id').lean().exec();

    if (!secret) {
      return res.status(404).json({
        success: false
      });
    } // Remove sensitive data and useless information


    delete secret._id;
    secret.likes = secret.likes.length;
    secret.commentsData = comments;
    secret.comments = comments.length;
    res.status(200).json({
      success: true,
      secret
    });
  });

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;