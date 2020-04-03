;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
import axios from 'axios';
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

import joinOrLoginFacebook from '../../auth/facebook-auth.js';

// Post login/ Register login vía facebook\
router.post('/login', async function (req, res, next) {
  const { tokenFB } = req.body;

  let payload = {
    tokenFB
  };

  const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// Find User via Facebook || Register if user doesn't exists in database
  const response = await joinOrLoginFacebook(payload.tokenFB)
  .catch(err => {
    console.log(err, "Aqui el error que está pasando");
  });

  //Get last position
  // TODO: Get clear this code and break into chunks of code and files.
  console.log(response, "RESPONSEEEEEE");

  const sendInvalidUser = {
    token: false,
    status: false,
    error: 'login.failed_token',
  };

  if (!response) {
    return res.status(403).json(sendInvalidUser);
  }

  const userData = {};
  const isUserNew = response.isNew;
  userData.facebookId = response.authProviders.facebook.id;
  userData.id = `${response._id}`;
  // console.log(req.body, payload, "req ====");

  // Returned respones based on response value
  if (response && response._id) {
    const token = jwt.sign(userData.id, jwtOptions.secret);

    axios.get(`https://api.telegram.org/bot'
    ${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=183061705&text="Se ha unido un nuevo usuario a las "`);

    return res.status(200).json({
      token: token,
      isUserNew,
      status: true,
    });
  } else {
    return res.status(403).json(sendInvalidUser);
  }
});

module.exports = router;
