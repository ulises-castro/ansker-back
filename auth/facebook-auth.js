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

  const facebookUserData = await axios.get(url);
  const userLocation = getUserLocation(ipUser);

  const userData = [...facebookUserData, ...userLocation];

  // TODO: This is temporaly, remove when added more ways to log
  userData['provider'] = 'facebook';
  userData['facebookToken'] = facebookToken;

  // TODO: Find user in database via ID, and if it doesnt exists lets added.
  if (true) {
    return registerUserDB(userLocation, ipUser);
  } else {

  }

  console.log(facebookUserData, "Holaaa a todos");
}

// Save user into database
async function registerUserDB(userData, ipUser) {

  console.log(userData, "USERDATAAA");

  const registerAt = new Date();
  const {
    ip,
    country_code,
    region_name,
    region_code,
    latitude,
    longitude,
    id,
    name,
    facebookToken
  } = userData;

  let newUser = User({
    username: 'primerotesting',
    // ip,
    ipLogs: {
      ip: ipUser,
      location: {
        countryCode: country_code,
        regionName: region_name,
        regionCode: region_code,
        latitude,
        longitude,
      }
    },
    // authProvider TODO: Facebook is only way to get access
    authProviders: {
      facebook: {
        id,
        name,
        email: '',
        token: facebookToken,
      }
    },
    registerAt,
  });

  return await newUser.save();

  // (res) => {
  //   if (err) throw err;
  //   console.log(res, "RESPONSE new user");
  // });
}

export default joinOrLoginFacebook;
