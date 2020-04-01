"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGoogleUserInfo = getGoogleUserInfo;
exports.getAccessTokenFromCode = getAccessTokenFromCode;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getAccessTokenFromCode(_x, _x2, _x3) {
  return _getAccessTokenFromCode.apply(this, arguments);
}

function _getAccessTokenFromCode() {
  _getAccessTokenFromCode = _asyncToGenerator(function* (req, res, next) {
    var {
      code
    } = req.params;
    var {
      data
    } = yield (0, _axios.default)({
      url: "https://oauth2.googleapis.com/token",
      method: 'post',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
        code
      }
    });
    console.log(data, "DATA token"); // { access_token, expires_in, token_type, refresh_token }

    return res.status(200).json({
      data
    });
    return data.access_token;
  });
  return _getAccessTokenFromCode.apply(this, arguments);
}

;

function getGoogleUserInfo(_x4) {
  return _getGoogleUserInfo.apply(this, arguments);
}

function _getGoogleUserInfo() {
  _getGoogleUserInfo = _asyncToGenerator(function* (access_token) {
    var {
      data
    } = yield (0, _axios.default)({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: "Bearer ".concat(accesstoken)
      }
    });
    console.log(data); // { id, email, given_name, family_name }

    return data;
  });
  return _getGoogleUserInfo.apply(this, arguments);
}

;