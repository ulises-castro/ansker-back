'use strict';

var jwt = require('jsonwebtoken');

var secret = process.env.JWT_SECRET_PASSWORD;

module.exports.verify = function (token) {
  return jwt.verify(token, secret);
};

module.exports.generateToken = function (user) {
  return jwt.sign({
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  }, secret);
};