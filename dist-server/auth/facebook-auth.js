"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _user = _interopRequireDefault(require("../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

;

var axios = require('axios');

var client_id = process.env.FACEBOOK_CLIENT_ID;
var client_secret = process.env.FACEBOOK_CLIENT_SECRET;
var fbUrl = 'https://graph.facebook.com';

var joinOrLoginFacebook = /*#__PURE__*/function () {
  var _joinOrLoginFacebookAndVerified = _asyncToGenerator(function* (facebookToken) {
    // Get AppToken ###########################
    var appToken;
    var url = "".concat(fbUrl, "/oauth/access_token?client_id=").concat(client_id, "&client_secret=").concat(client_secret, "&grant_type=client_credentials");
    var response1 = yield axios.get(url);
    appToken = response1.data.access_token; // Checking appToken #########################

    url = "".concat(fbUrl, "/debug_token?input_token=").concat(facebookToken, "&access_token=").concat(appToken);
    var appFacebookData = yield axios.get(url);
    var {
      app_id,
      user_id,
      is_valid
    } = appFacebookData.data.data; // console.log("Entro 22", appFacebookData.data.data, "---------");

    if (app_id !== client_id) {
      return false;
      throw new Error("Invalid app id: expected: app_id received ".concat(app_id, " instead of: ").concat(client_id));
    } // It's okay, get user information #############


    url = "".concat(fbUrl, "/v3.2/").concat(user_id, "?fields=id,name,picture,email&access_token=").concat(appToken); // TODO: Creater catch error handler. ###################

    var facebookUserData = yield axios.get(url); // TODO: This is temporaly, remove when added more ways to log

    facebookUserData = facebookUserData.data;
    facebookUserData['provider'] = 'facebook';
    facebookUserData['facebookToken'] = facebookToken;
    facebookUserData['email'] = facebookUserData.email || '';
    var userIdFB = facebookUserData.id; // TODO: Find user in database via ID, and if it doesnt exists lets added.

    console.log(userIdFB, "Obteniendo el facebook ID");
    var userData = yield _user.default.findUserOrRegister(userIdFB, facebookUserData);
    return userData;
  });

  function joinOrLoginFacebookAndVerified(_x) {
    return _joinOrLoginFacebookAndVerified.apply(this, arguments);
  }

  return joinOrLoginFacebookAndVerified;
}();

var _default = joinOrLoginFacebook;
exports.default = _default;