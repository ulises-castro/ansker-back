import axios from 'axios';
import * as queryString from 'query-string';

const stringifiedParams = queryString.stringify({
  client_id: process.env.CLIENT_ID_GOES_HERE,
  redirect_uri: 'https://www.example.com/authenticate/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

async function getAccessTokenFromCode(code) {
  const {
    data
  } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.APP_ID_GOES_HERE,
      client_secret: process.env.APP_SECRET_GOES_HERE,
      redirect_uri: 'https://www.example.com/authenticate/google',
      grant_type: 'authorization_code',
      code,
    },
  });
  console.log(data); // { access_token, expires_in, token_type, refresh_token }
  return data.access_token;
};
