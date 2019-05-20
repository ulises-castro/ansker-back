'use strict';

var googleApi = require('../libs/google');
var url = require('url');

exports.requestGmailAuth = function (req, res, next) {
  var scopes = ['profile', 'email', 'openid'];

  var url = googleApi.generateUrl(scopes);
  res.redirect(url);
};

exports.getGmailUserInfo = async function (req, res, next) {
  var qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
  var code = qs.get('code');

  if (!code) {
    next(new Error('No code provided'));
  }

  googleApi.getUserInfo(code).then(function (response) {
    res.send(response.data);
  }).catch(function (e) {
    console.log('Error Google Api');
    next(new Error(e.message));
  });
};