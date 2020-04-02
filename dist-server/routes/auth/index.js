"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _facebookAuth = _interopRequireDefault(require("../../auth/facebook-auth.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

;

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;
// Post login/ Register login vía facebook\
router.post('/login', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    var {
      tokenFB
    } = req.body;
    var payload = {
      tokenFB
    };
    var ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Find User via Facebook || Register if user doesn't exists in database

    var response = yield (0, _facebookAuth.default)(payload.tokenFB).catch(err => {
      console.log(err, "Aqui el error que está pasando");
    }); //Get last position
    // TODO: Get clear this code and break into chunks of code and files.

    console.log(response, "RESPONSEEEEEE");
    var sendInvalidUser = {
      token: false,
      status: false,
      error: 'login.failed_token'
    };

    if (!response) {
      return res.status(403).json(sendInvalidUser);
    }

    var userData = {};
    var isUserNew = response.isNew;
    userData.facebookId = response.authProviders.facebook.id;
    userData.id = "".concat(response._id); // console.log(req.body, payload, "req ====");
    // Returned respones based on response value

    if (response && response._id) {
      var token = jwt.sign(userData.id, jwtOptions.secret);

      _axios.default.get("https://api.telegram.org/bot'\n    ".concat(process.env.TELEGRAM_TOKEN, "/sendMessage?chat_id=183061705&text=\"Se ha unido un nuevo usuario a las \""));

      return res.status(200).json({
        token: token,
        isUserNew,
        status: true
      });
    } else {
      return res.status(403).json(sendInvalidUser);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;