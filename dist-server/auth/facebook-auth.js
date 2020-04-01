"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _user = _interopRequireDefault(require("../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var axios = require('axios');

var client_id = process.env.FACEBOOK_CLIENT_ID;
var client_secret = process.env.FACEBOOK_CLIENT_SECRET;
var fbUrl = 'https://graph.facebook.com';

var joinOrLoginFacebook = /*#__PURE__*/function () {
  var _joinOrLoginFacebookAndVerified = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(facebookToken) {
    var appToken, url, response1, appFacebookData, _appFacebookData$data, app_id, user_id, is_valid, facebookUserData, userIdFB, userData;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Get AppToken ###########################
            url = "".concat(fbUrl, "/oauth/access_token?client_id=").concat(client_id, "&client_secret=").concat(client_secret, "&grant_type=client_credentials");
            _context.next = 3;
            return axios.get(url);

          case 3:
            response1 = _context.sent;
            appToken = response1.data.access_token; // Checking appToken #########################

            url = "".concat(fbUrl, "/debug_token?input_token=").concat(facebookToken, "&access_token=").concat(appToken);
            _context.next = 8;
            return axios.get(url);

          case 8:
            appFacebookData = _context.sent;
            _appFacebookData$data = appFacebookData.data.data, app_id = _appFacebookData$data.app_id, user_id = _appFacebookData$data.user_id, is_valid = _appFacebookData$data.is_valid; // console.log("Entro 22", appFacebookData.data.data, "---------");

            if (!(app_id !== client_id)) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", false);

          case 13:
            // It's okay, get user information #############
            url = "".concat(fbUrl, "/v3.2/").concat(user_id, "?fields=id,name,picture,email&access_token=").concat(appToken); // TODO: Creater catch error handler. ###################

            _context.next = 16;
            return axios.get(url);

          case 16:
            facebookUserData = _context.sent;
            // TODO: This is temporaly, remove when added more ways to log
            facebookUserData = facebookUserData.data;
            facebookUserData['provider'] = 'facebook';
            facebookUserData['facebookToken'] = facebookToken;
            facebookUserData['email'] = facebookUserData.email || '';
            userIdFB = facebookUserData.id; // TODO: Find user in database via ID, and if it doesnt exists lets added.

            console.log(userIdFB, "Obteniendo el facebook ID");
            _context.next = 25;
            return _user.default.findUserOrRegister(userIdFB, facebookUserData);

          case 25:
            userData = _context.sent;
            return _context.abrupt("return", userData);

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function joinOrLoginFacebookAndVerified(_x) {
    return _joinOrLoginFacebookAndVerified.apply(this, arguments);
  }

  return joinOrLoginFacebookAndVerified;
}();

var _default = joinOrLoginFacebook;
exports.default = _default;