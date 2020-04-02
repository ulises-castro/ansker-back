const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import Secret from '../models/secret';
import Comment from '../models/comment';

;

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),
async function (req, res) {

  const author = req.user._id;
  let { secretId, content } = req.body;

  console.log(req.body, 'qué pedo mi perro');

  const commentData = {
    secretId,
    content,
    author,
  };

  console.log(commentData, "coemnatrios");

  const response = await Comment.publish(secretId, commentData);

  if (response) {
    return res.status(200).json({
      success: true,
    });
  }

  res.status(403).json({
    success: false,
    error: 'secret.publish.comment',
  });
});

module.exports = router;
