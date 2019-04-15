'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipProviderUrl = 'http://api.ipstack.com';
var access_token = process.env.IPTOKEN;

var getUserLocation = async function getUserLocation(ipUser) {
  var response = await _axios2.default.get(ipProviderUrl + '/' + ipUser + '?access_key=' + access_token);

  console.log("Entro aquí IP====,", ipUser, response);

  return response;
};

exports.default = getUserLocation;