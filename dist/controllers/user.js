'use strict';

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var userData = response.data;
    userData.email = userData.emails[0].value;
    userData.name = userData.displayName;

    var newUser = _user2.default.findUserOrRegister(userData.id, userData, 'google');

    return res.send(response.data);
  }).catch(function (e) {
    console.log('Error Google Api');
    next(new Error(e.message));
  });
};