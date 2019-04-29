const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import Secret from '../models/secret';
import Comment from '../models/comment';

require('dotenv').config();

router.post('/', passport.authenticate('jwt', {
  session: false,
}),
async function (req, res) {

  // Colors avatars
  // Todo boiler plate, fix that
  const availableColours = [
    '#0000ff', '#ffa500', '#065535',
    '#ffc0cb', '#ff0000', '#003366',
    '#008080', '#8a2be2', '#666666',
    '#ff1493'
  ];

  const maxAllowed = availableColours.length;
  const getColor = Math.floor(Math.random() * (maxAllowed)) + 1;
  const backgroundColor = availableColours[getColor];

  const author = req.user._id;
  let { secretId, content } = req.body;

  console.log(req.body, 'qué pedo mi perro');

  const commentData = {
    secretId,
    content,
    backgroundColor,
    author,
  };

  const response = await Comment.publish(secretId, commentData);

  if (response) {
    return res.status(200).json({
      success: true,
    });
  }

  res.status(403).json({
    success: false,
  });
});

module.exports = router;
