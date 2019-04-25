'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var axios = require('axios');

var client_id = process.env.FACEBOOK_CLIENT_ID;
var client_secret = process.env.FACEBOOK_CLIENT_SECRET;

var fbUrl = 'https://graph.facebook.com';

var joinOrLoginFacebook = async function joinOrLoginFacebookAndVerified(facebookToken, ipUser) {
  // Get AppToken ###########################
  var appToken = void 0;
  var url = fbUrl + '/oauth/access_token?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials';

  var response1 = await axios.get(url);

  appToken = response1.data.access_token;

  // Checking appToken #########################
  url = fbUrl + '/debug_token?input_token=' + facebookToken + '&access_token=' + appToken;
  var appFacebookData = await axios.get(url);

  var _appFacebookData$data = appFacebookData.data.data,
      app_id = _appFacebookData$data.app_id,
      user_id = _appFacebookData$data.user_id,
      is_valid = _appFacebookData$data.is_valid;

  // console.log("Entro 22", appFacebookData.data.data, "---------");

  if (app_id !== client_id) {

    return false;

    throw new Error('Invalid app id: expected: app_id received ' + app_id + ' instead of: ' + client_id);
  }

  // It's okay, get user information #############
  url = fbUrl + '/v3.2/' + user_id + '?fields=id,name,picture,email&access_token=' + appToken;

  // TODO: Creater catch error handler. ###################

  var facebookUserData = await axios.get(url);

  // TODO: This is temporaly, remove when added more ways to log
  facebookUserData = facebookUserData.data;
  facebookUserData['provider'] = 'facebook';
  facebookUserData['facebookToken'] = facebookToken;
  facebookUserData['email'] = facebookUserData.email || '';
  facebookUserData['ip'] = ipUser;

  var userIdFB = facebookUserData.id;

  // TODO: Find user in database via ID, and if it doesnt exists lets added.
  console.log(userIdFB, "Obteniendo el facebook ID");
  var userData = await _user2.default.findUserOrRegister(userIdFB, facebookUserData);

  return userData;
};

exports.default = joinOrLoginFacebook;