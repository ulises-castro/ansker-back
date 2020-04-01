"use strict";

var _facebookAuth = _interopRequireDefault(require("../auth/facebook-auth"));

var _user = _interopRequireDefault(require("../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var passport = require('passport');

var passportJWT = require('passport-jwt');

var jwt = require('jsonwebtoken');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
// Configuration
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET_PASSWORD;
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  _user.default.findOne({
    '_id': jwt_payload
  }, function (err, user) {
    console.log('Aqui entro, payload', jwt_payload, user);

    if (err) {
      done(err, false);
    }

    var userData = user;

    if (user && user.locations.length) {
      console.log(user, 'Userdata');
      var lastLocation = userData.locations.length - 1;
      var location = userData.locations[lastLocation];
      userData.location = location.location;
    }

    done(null, userData);
  });
});
passport.use(strategy);