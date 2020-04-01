'use strict'
// TODO: Remove from controller and move to routes
require('dotenv').config();

import * as queryString from 'query-string';
import axios from 'axios'

// import {
//   getGoogleUserInfo,
//   getAccessTokenFromCode
// } from '../auth/google-auth'

import User from '../models/user';
import {
  accessSync
} from 'fs';

var url = require('url');

const jwt = require('jsonwebtoken');
const jwtOptions = {};

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

const URL_API = process.env.URL_API;
const URL_FRONT = process.env.URL_FRONT;


// async function getAccessTokenFromCode(req, res, next) {
//   const {
//     data
//   } = await axios({
//     url: 'https://www.googleapis.com/oauth2/v2/userinfo',
//     method: 'get',
//     headers: {
//       Authorization: `Bearer ${accesstoken}`,
//     },
//   });
//   console.log(data); // { id, email, given_name, family_name }

//   return res.status(200).json({
//     data
//   })
// };

async function getAccessTokenFromCode(req, res, next) {
  const {
    code
  } = req.query

  const {
    data
  } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      // redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      redirect_uri: 'http://localanskerme.me:1297/authenticate/google',
      grant_type: 'authorization_code',
      code
    },
  })
  console.log(data); // { access_token, expires_in, token_type, refresh_token }

};

export {
  getAccessTokenFromCode,
}
