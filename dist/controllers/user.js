'use strict';
// TODO: Remove from controller and move to routes

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGoogleUserCode = undefined;

var _queryString = require('query-string');

var queryString = _interopRequireWildcard(_queryString);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

require('dotenv').config();

// import {
//   getGoogleUserInfo,
//   getAccessTokenFromCode
// } from '../auth/google-auth'

var url = require('url');

var jwt = require('jsonwebtoken');
var jwtOptions = {};

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

var URL_API = process.env.URL_API;
var URL_FRONT = process.env.URL_FRONT;

async function getGoogleUserCode(req, res, next) {
  // const urlParams = queryString.parse(window.location.search);

  res.redirect('gola' + res);
  if (urlParams.error) {
    console.log('An error occurred: ' + urlParams.error);
  } else {
    console.log('The code is: ');

    // const token = await getAccessTokenFromCode(urlParams.code)

    res.redirect('' + urlParams.code);

    // const googleUserInfo = await getGoogleUserInfo(token)

    // console.log(googleUserInfo)
  }
}

async function getAccessTokenFromCode(code) {
  var _ref = await axios({
    url: 'https://oauth2.googleapis.com/token',
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code
    }
  }),
      data = _ref.data;

  console.log(data); // { access_token, expires_in, token_type, refresh_token }
  return data.access_token;
};

async function getGoogleUserInfo(access_token) {
  var _ref2 = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + accesstoken
    }
  }),
      data = _ref2.data;

  console.log(data); // { id, email, given_name, family_name }
  return data;
};
// 


exports.getGoogleUserCode = getGoogleUserCode;

// exports.requestGmailAuth = function (req, res, next) {
//   const scopes = ['profile', 'email', 'openid'];

//   let url = googleApi.generateUrl(scopes)
//   res.redirect(url);
// }

// async function registerOrLoginUser(response, res) {
//   const userData = response.data;
//   userData.email = userData.emails[0].value;
//   userData.name = userData.displayName;

//   const newUser = await User.findUserOrRegister(
//     userData.id,
//     userData,
//     'google'
//   );

//   const token = jwt.sign(
//     newUser.id, jwtOptions.secret
//   );

//   res.redirect(`${URL_FRONT}/get-token/${token}`);
// }

// exports.getGmailUserInfo =
//   async function (req, res, next) {
//     const qs = new url.URL(req.url, URL_API).searchParams;
//     let code = qs.get('code');

//     if (!code) {
//       next(new Error('No code provided'))
//     }

//     googleApi.getUserInfo(code)
//     .then(function(response) {
//       registerOrLoginUser(response, res);
//     })
//     .catch(function(e) {
//       console.log('Error Google Api');
//       next(new Error(e.message));
//     })
//   }