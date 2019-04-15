require('dotenv').config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

import joinOrLoginFacebook from '../auth/facebook-auth';

// Configuration

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET_PASSWORD;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('Aqui entro, payload', jwt_payload, joinOrLoginFacebook(jwt_payload));

  // joinOrLoginFacebook(jwt_payload);

  next(false, { user: 'hola'});
});

passport.use(strategy);
