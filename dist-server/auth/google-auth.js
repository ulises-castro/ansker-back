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
  _getAccessTokenFromCode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var code, _yield$axios, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            code = req.params.code;
            _context.next = 3;
            return (0, _axios.default)({
              url: "https://oauth2.googleapis.com/token",
              method: 'post',
              data: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
                code: code
              }
            });

          case 3:
            _yield$axios = _context.sent;
            data = _yield$axios.data;
            console.log(data, "DATA token"); // { access_token, expires_in, token_type, refresh_token }

            return _context.abrupt("return", res.status(200).json({
              data: data
            }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAccessTokenFromCode.apply(this, arguments);
}

;

function getGoogleUserInfo(_x4) {
  return _getGoogleUserInfo.apply(this, arguments);
}

function _getGoogleUserInfo() {
  _getGoogleUserInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(access_token) {
    var _yield$axios2, data;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _axios.default)({
              url: 'https://www.googleapis.com/oauth2/v2/userinfo',
              method: 'get',
              headers: {
                Authorization: "Bearer ".concat(accesstoken)
              }
            });

          case 2:
            _yield$axios2 = _context2.sent;
            data = _yield$axios2.data;
            console.log(data); // { id, email, given_name, family_name }

            return _context2.abrupt("return", data);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getGoogleUserInfo.apply(this, arguments);
}

;