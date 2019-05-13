'use strict';

var _secret = require('../models/secret');

var _secret2 = _interopRequireDefault(_secret);

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

require('dotenv').config();

router.post('/', passport.authenticate('jwt', {
  session: false
}), async function (req, res) {

  // Colors avatars
  // Todo boiler plate, fix that
  var availableColours = ['#0000ff', '#ffa500', '#065535', '#ffc0cb', '#ff0000', '#003366', '#008080', '#8a2be2', '#666666', '#ff1493'];

  var maxAllowed = availableColours.length;
  var getColor = Math.floor(Math.random() * maxAllowed) + 1;
  var backgroundColor = availableColours[getColor];

  var author = req.user._id;
  var _req$body = req.body,
      secretId = _req$body.secretId,
      content = _req$body.content;


  console.log(req.body, 'qué pedo mi perro');

  var commentData = {
    secretId: secretId,
    content: content,
    backgroundColor: backgroundColor,
    author: author
  };

  var response = await _comment2.default.publish(secretId, commentData);

  if (response) {
    return res.status(200).json({
      success: true
    });
  }

  res.status(403).json({
    success: false,
    error: 'secret.publish.comment'
  });
});

module.exports = router;