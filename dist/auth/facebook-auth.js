'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var client_id = process.env.FACEBOOK_CLIENT_ID;
var client_secret = process.env.FACEBOOK_CLIENT_SECRET;

var fbUrl = 'https://graph.facebook.com';

var getFacebookUser = async function getFacebookUserAndVerified(facebookToken) {
  var appToken = void 0;
  var url = fbUrl + '/oauth/access_token?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials';

  var response1 = await axios.get(url);

  appToken = response1;

  console.log(response1);
};

exports.default = getFacebookUser;
//
// module.exports.getUser = code => {
//   let appToken;
//   let url = `${fbUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;
//   return fetch(url, {
//     method: 'GET'
//   })
//     .then(response => response.json())
//
//     .then(response => {
//       appToken = response.access_token;
//
//       return fetch(
//         `${fbUrl}/debug_token?input_token=${code}&access_token=${access_token}`,{
//           method: 'GET',
//         }
//       );
//     })
//     .then(response => response.json())
//     .then(response => {
//       const {
//         app_id,
//         is_valid,
//         user_id
//       } = response.data;
//
//       if (app_id !== client_id) {
//         throw new Error(
//           'invalid app id: expected [' +
//             client_id +
//             '] but was [' +
//             app_id +
//             ']'
//         );
//       }
//       if (!is_valid) {
//         throw new Error('token is not valid');
//       }
//       return fetch(
//           fbUrl +
//           '/v3.2/' +
//           user_id +
//           '?fields=id,name,picture,email&access_token=' +
//           appToken,
//         {
//           method: 'GET'
//         }
//       );
//     })
//     .then(response => response.json())
//     .then(response => {
//       const { id, picture, email, name } = response;
//       let user = {
//         name: name,
//         pic: picture.data.url,
//         id: id,
//         email_verified: true,
//         email: email
//       };
//       return user;
//     })
//
//     .catch(err => {
//       throw new Error(
//         'error while authenticating facebook user: ' + JSON.stringify(err)
//       );
//     });
// }