require('dotenv').config();

var axios = require('axios');

import User from '../models/user';

import getUserLocation from './getLocation';

const client_id = process.env.FACEBOOK_CLIENT_ID;
const client_secret = process.env.FACEBOOK_CLIENT_SECRET;

let fbUrl = 'https://graph.facebook.com';

const joinOrLoginFacebook = async function joinOrLoginFacebookAndVerified(facebookToken, ipUser) {
  // Get AppToken ###########################
  let appToken;
  let url = `${fbUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;

  const response1 = await axios.get(url);

  appToken = response1.data.access_token;

  // Checking appToken #########################
  url = `${fbUrl}/debug_token?input_token=${facebookToken}&access_token=${appToken}`;
  const appFacebookData = await axios.get(url);

  const {
    app_id,
    user_id,
    is_valid,
  } = appFacebookData.data.data;

  console.log("Entro 22", appFacebookData.data.data, "---------");

  if (app_id !== client_id) {

    return false;

    throw new Error(
      `Invalid app id: expected: app_id received ${app_id} instead of: ${client_id}`
    );
  }

  // It's okay, get user information #############
  url = `${fbUrl}/v3.2/${user_id}?fields=id,name,picture,email&access_token=${appToken}`;

  // TODO: Creater catch error handler. ###################
  // facebookUserData.catch(err => {
  //   throw new Error(
  //     'error while authenticating facebook user: ' + JSON.stringify(err)
  //   );
  // });

  let facebookUserData = await axios.get(url);
  facebookUserData = facebookUserData.data;
  const userIdFB = facebookUserData.id;
  const userLocation = await getUserLocation(ipUser);

  const userData = {};

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
  return User.findUserOrRegister(userIdFB, userData);

}

export default joinOrLoginFacebook;
