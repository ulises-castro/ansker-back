// TODO: Remove from controller and move to routes
require('dotenv').config();

'use strict'
const googleApi = require('../libs/google');

import User from '../models/user';

var url = require('url');

const jwt = require('jsonwebtoken');
const jwtOptions = {};

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

const URL_API = process.env.URL_API;
const URL_FRONT = process.env.URL_FRONT;

exports.requestGmailAuth = function (req, res, next) {
  const scopes = ['profile', 'email', 'openid'];

  let url = googleApi.generateUrl(scopes)
  res.redirect(url);
}

async function registerOrLoginUser(response, res) {
  const userData = response.data;
  userData.email = userData.emails[0].value;
  userData.name = userData.displayName;

  const newUser = await User.findUserOrRegister(
    userData.id,
    userData,
    'google'
  );

  const token = jwt.sign(
    newUser.id, jwtOptions.secret
  );

  // return res.status.(200).json(send(response.data);

  res.redirect(`${URL_FRONT}/get-token/${token}`);
}

exports.getGmailUserInfo =
  async function (req, res, next) {
    const qs = new url.URL(req.url, URL_API).searchParams;
    let code = qs.get('code');

    if (!code) {
      next(new Error('No code provided'))
    }

    googleApi.getUserInfo(code)
    .then(function(response) {
      registerOrLoginUser(response);
    })
    .catch(function(e) {
      console.log('Error Google Api');
      next(new Error(e.message));
    })
}