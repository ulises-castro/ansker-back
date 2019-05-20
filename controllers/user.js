'use strict'
const googleApi = require('../libs/google');

import User from '../models/user';

var url = require('url');

exports.requestGmailAuth = function (req, res, next) {
  const scopes = ['profile', 'email', 'openid'];

  let url = googleApi.generateUrl(scopes)
  res.redirect(url);
}

exports.getGmailUserInfo =
  async function (req, res, next) {
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    let code = qs.get('code');

    if (!code) {
      next(new Error('No code provided'))
    }

    googleApi.getUserInfo(code)
    .then(function(response) {
      const userData = response.data;
      userData.email = userData.emails[0].value;
      userData.name = userData.displayName;

      const newUser = User.findUserOrRegister(
        userData.id,
        userData,
        'google'
      );

      return res.send(response.data);
    })
    .catch(function(e) {
      console.log('Error Google Api');
      next(new Error(e.message));
    })
}