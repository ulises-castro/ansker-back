'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccessTokenFromCode = void 0;

var queryString = _interopRequireWildcard(require("query-string"));

var _axios = _interopRequireDefault(require("axios"));

var _user = _interopRequireDefault(require("../models/user"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var url = require('url');

var jwt = require('jsonwebtoken');

var jwtOptions = {};
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;
var URL_API = process.env.URL_API;
var URL_FRONT = process.env.URL_FRONT; // async function getAccessTokenFromCode(req, res, next) {
//   const {
//     data
//   } = await axios({
//     url: 'https://www.googleapis.com/oauth2/v2/userinfo',
//     method: 'get',
//     headers: {
//       Authorization: `Bearer ${accesstoken}`,
//     },
//   });
//   console.log(data); // { id, email, given_name, family_name }
//   return res.status(200).json({
//     data
//   })
// };

var getAccessTokenFromCode = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    var {
      code
    } = req.query;

    try {
      var {
        data
      } = yield (0, _axios.default)({
        url: "https://oauth2.googleapis.com/token",
        method: 'post',
        data: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: "".concat(PROCESS.env.URL_FRONT, "/authenticate/google"),
          grant_type: 'authorization_code',
          code
        }
      });
      console.log(data); // { access_token, expires_in, token_type, refresh_token }

      return res.status(200).json(_objectSpread({}, data));
    } catch (err) {
      console.log(e, req.query);
      return next(err);
      return res.status(400).json({
        'error': 'unable.to.process'
      });
    }
  });

  return function getAccessTokenFromCode(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(); // TODO: Added a catch error handler
// async function getGoogleUserCode(req, res, next) {
//   // const urlParams = queryString.parse(window.location.search);
//   // TODO: fix me
//   // console.log()
//   // if (urlParams.error) {
//   //   console.log(`An error occurred: ${urlParams.error}`);
//   // } else {
//   const {
//     code
//   } = req.query
//   console.log(`The code is: ${code}`);
//   // return res.redirect('google/code' + req.query.code)
//   // const token = await getAccessTokenFromCode(urlParams.code)
//   // res.redirect(`${urlParams.code}, TOKEN:`)
//   try {
//     const access_token = await getAccessTokenFromCode(code)
//     const googleUserInfo = await getGoogleUserInfo(access_token)
//   } catch (e) {
//     console.log('ERROR ' + e)
//   }
//   // console.log(googleUserInfo)
//   return res.status(200).json({
//     access_token,
//     googleUserInfo
//   });
// }
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


exports.getAccessTokenFromCode = getAccessTokenFromCode;