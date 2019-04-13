'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var axios = require('axios');

var client_id = process.env.FACEBOOK_CLIENT_ID;
var client_secret = process.env.FACEBOOK_CLIENT_SECRET;

var fbUrl = 'https://graph.facebook.com';

var getFacebookUser = async function getFacebookUserAndVerified(facebookToken) {
  // Get AppToken ###########################
  var appToken = void 0;
  var url = fbUrl + '/oauth/access_token?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials';

  var response1 = await axios.get(url);

  appToken = response1.data.access_token;

  // Checking appToken #########################
  url = fbUrl + '/debug_token?input_token=' + facebookToken + '&access_token=' + appToken;
  var response2 = await axios.get(url);

  var _response2$data$data = response2.data.data,
      app_id = _response2$data$data.app_id,
      user_id = _response2$data$data.user_id,
      is_valid = _response2$data$data.is_valid;


  console.log("Entro 22", response2.data.data, "---------");

  if (app_id !== client_id) {

    return false;

    throw new Error('Invalid app id: expected: app_id received ' + app_id + ' instead of: ' + client_id);
  }

  // It's okay, get user information #############
  url = fbUrl + '/v3.2/' + user_id + '?fields=id,name,picture,email&access_token=' + appToken;

  var response3 = await axios.get(url);

  // response3.catch(err => {
  //   throw new Error(
  //     'error while authenticating facebook user: ' + JSON.stringify(err)
  //   );
  // });

  console.log(appToken, response3, "Holaaa a todos");
};

exports.default = getFacebookUser;