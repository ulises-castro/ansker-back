require('dotenv').config();

var axios = require('axios');

const client_id = process.env.FACEBOOK_CLIENT_ID;
const client_secret = process.env.FACEBOOK_CLIENT_SECRET;

let fbUrl = 'https://graph.facebook.com';

const joinOrLoginFacebook = async function joinOrLoginFacebookAndVerified(facebookToken) {
  // Get AppToken ###########################
  let appToken;
  let url = `${fbUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;

  const response1 = await axios.get(url);

  appToken = response1.data.access_token;

  // Checking appToken #########################
  url = `${fbUrl}/debug_token?input_token=${facebookToken}&access_token=${appToken}`;
  const response2 = await axios.get(url);

  const {
    app_id,
    user_id,
    is_valid,
  } = response2.data.data;

  console.log("Entro 22", response2.data.data, "---------");

  if (app_id !== client_id) {

    return false;

    throw new Error(
      `Invalid app id: expected: app_id received ${app_id} instead of: ${client_id}`
    );
  }

  // It's okay, get user information #############
  url = `${fbUrl}/v3.2/${user_id}?fields=id,name,picture,email&access_token=${appToken}`;

  const response3 = await axios.get(url);

  // response3.catch(err => {
  //   throw new Error(
  //     'error while authenticating facebook user: ' + JSON.stringify(err)
  //   );
  // });

  console.log(appToken, response3, "Holaaa a todos");
}

export default joinOrLoginFacebook;
