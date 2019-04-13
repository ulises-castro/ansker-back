const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

require('dotenv').config();

// Configuration
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login
router.post('/login', function (req, res, next) {

  const payload = { id: 1 };
  const token = jwt.sign(payload, jwtOptions.secret);
  return res.status(400).json({
    message: token,
  });
});

router.post('/secret', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  console.log('hola');
  res.json({ message: "Successs! yotube"});
});

module.exports = router;
