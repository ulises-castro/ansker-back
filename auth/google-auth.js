import axios from 'axios';
import * as queryString from 'query-string';

async function getAccessTokenFromCode(code) {
  const {
    data
  } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
    },
  });
  console.log(data); // { access_token, expires_in, token_type, refresh_token }
  return data.access_token;
};

async function getGoogleUserInfo(access_token) {
  const {
    data
  } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  });
  console.log(data); // { id, email, given_name, family_name }
  return data;
};

export {
  getGoogleUserInfo,
  getAccessTokenFromCode,
}
