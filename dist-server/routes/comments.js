"use strict";

var _secret = _interopRequireDefault(require("../models/secret"));

var _comment = _interopRequireDefault(require("../models/comment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var passport = require('passport');

var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false
}), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    var author = req.user._id;
    var {
      secretId,
      content
    } = req.body;
    console.log(req.body, 'qué pedo mi perro');
    var commentData = {
      secretId,
      content,
      author
    };
    console.log(commentData, "coemnatrios");
    var response = yield _comment.default.publish(secretId, commentData);

    if (response) {
      return res.status(200).json({
        success: true
      });
    }

    res.status(403).json({
      success: false,
      error: 'secret.publish.comment'
    });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;