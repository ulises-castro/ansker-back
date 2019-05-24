'use strict';

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Remove from controller and move to routes
require('dotenv').config();

'use strict';
var googleApi = require('../libs/google');

var url = require('url');

var jwt = require('jsonwebtoken');
var jwtOptions = {};

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

var URL_API = process.env.URL_API;
var URL_FRONT = process.env.URL_FRONT;

exports.requestGmailAuth = function (req, res, next) {
  var scopes = ['profile', 'email', 'openid'];

  var url = googleApi.generateUrl(scopes);
  res.redirect(url);
};

async function registerOrLoginUser(response, res) {
  var userData = response.data;
  userData.email = userData.emails[0].value;
  userData.name = userData.displayName;

  var newUser = await _user2.default.findUserOrRegister(userData.id, userData, 'google');

  var token = jwt.sign(newUser.id, jwtOptions.secret);

  // return res.status.(200).json(send(response.data);

  res.redirect(URL_FRONT + '/get-token/' + token);
}

exports.getGmailUserInfo = async function (req, res, next) {
  var qs = new url.URL(req.url, URL_API).searchParams;
  var code = qs.get('code');

  if (!code) {
    next(new Error('No code provided'));
  }

  googleApi.getUserInfo(code).then(function (response) {
    registerOrLoginUser(response);
  }).catch(function (e) {
    console.log('Error Google Api');
    next(new Error(e.message));
  });
};