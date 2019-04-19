'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _getLocation = require('./getLocation');

var _getLocation2 = _interopRequireDefault(_getLocation);

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


  console.log("Entro 22", appFacebookData.data.data, "---------");

  if (app_id !== client_id) {

    return false;

    throw new Error('Invalid app id: expected: app_id received ' + app_id + ' instead of: ' + client_id);
  }

  // It's okay, get user information #############
  url = fbUrl + '/v3.2/' + user_id + '?fields=id,name,picture,email&access_token=' + appToken;

  // TODO: Creater catch error handler. ###################
  // facebookUserData.catch(err => {
  //   throw new Error(
  //     'error while authenticating facebook user: ' + JSON.stringify(err)
  //   );
  // });

  var facebookUserData = await axios.get(url);
  facebookUserData = facebookUserData.data;
  var userIdFB = facebookUserData.id;
  var userLocation = await (0, _getLocation2.default)(ipUser);

  var userData = {};

  // TODO: This is temporaly, remove when added more ways to log
  userData['provider'] = 'facebook';
  userData['facebookToken'] = facebookToken;
  userData['name'] = facebookUserData.name;
  userData['id'] = facebookUserData.id;
  userData['email'] = facebookUserData.email || '';
  // Location user
  userData['ip'] = ipUser;
  userData['location'] = userLocation.data;

  console.log(userData, "Holaaa a todos");

  // TODO: Find user in database via ID, and if it doesnt exists lets added.
  return _user2.default.findUserOrRegister(userIdFB, userData);
};

exports.default = joinOrLoginFacebook;