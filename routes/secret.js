const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

import Secret from '../models/secret';

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}),
function(req, res) {

  const availableColours = [
    '#0000ff', '#ffa500', '#065535',
    '#ffc0cb', '#ff0000', '#003366',
    '#008080', '#8a2be2', '#666666',
    '#ff1493'
  ];

  // console.log(req.user, "Holaaaa");
  const invalidDataReceived = {
    error: 'secret.publish.invalid'
  };

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json(invalidDataReceived);
  }

  // TODO: Added into middleware to avoid boilerplate
  const { location } = req.user;

  const newSecret = new Secret({
    author: req.user._id,
    content: req.body.content,
    backgroundColor: req.body.backgroundColor,
    location,
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
  session: false,
}),
async function(req, res) {
   const {
     countryCode,
     regionCode,
     city,
   } = req.user.location;

   let secrets = await Secret.getAllByCity(countryCode, regionCode, city);

   // secrets.forEach(secret => {
   //   secret.howmuch = secret.likes.length;
   // });
   const response = secrets;
   for (let key in response) {
     response[key].how = 1;
   }

   res.status(200).json({
     secrets,
     response,
   });
});

router.post('/liked', passport.authenticate('jwt', {
  session: false,
}),
async function(req, res) {
  const userData = req.user;
  const secretId = req.body.secretId;
  const author = userData._id;

  const secret = await Secret.setLiked(secretId, author);
  console.log(secret);

  if (secret) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(403).json({
      error: 'secret.error.setLike'
    });
  }

});

module.exports = router;
