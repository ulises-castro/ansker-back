'use strict'
// TODO: Remove from controller and move to routes
;
import to from 'await-to-js'

import * as queryString from 'query-string';
import axios from 'axios'

import handler from 'helpers/handler'

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

const getGoogleInfo = async (req, res, next) => {
  const [ err, data ] = await to(axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  }));
  console.log(data); // { id, email, given_name, family_name }
  if (!err) return res.status(200).json({
    data
  })

  next(err)
};

const getAccessTokenFromCode = async (req, res, next) => {
  const {
    code
  } = req.query

  const [ err, data ] = await to(axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.URL_FRONT}/authenticate/google`,
        grant_type: 'authorization_code',
        code
      },
    }))

    if (data) {
      res.status(200).json({
        ...data
      })
    }
    console.log(data, err); // { access_token, expires_in, token_type, refresh_token }
    next(err)
}



// TODO: Added a catch error handler
async function registerOrLoginUser(response, res) {
  const userData = response.data;
  userData.email = userData.emails[0].value;
  userData.name = userData.displayName;

  const newUser = await User.findUserOrRegister(
    userData.id,
    userData,
    'google'
  );

  const token = jwt.sign(
    newUser.id, jwtOptions.secret
  );

  res.redirect(`${URL_FRONT}/get-token/${token}`);
}

export {
  getGoogleInfo,
  getAccessTokenFromCode,
}
// async function getGoogleUserCode(req, res, next) {
//   // const urlParams = queryString.parse(window.location.search);


//   // TODO: fix me
//   // console.log()
//   // if (urlParams.error) {
//   //   console.log(`An error occurred: ${urlParams.error}`);
//   // } else {
//   const {
//     code
//   } = req.query
//   console.log(`The code is: ${code}`);

//   // return res.redirect('google/code' + req.query.code)
//   // const token = await getAccessTokenFromCode(urlParams.code)

//   // res.redirect(`${urlParams.code}, TOKEN:`)

//   try {
//     const access_token = await getAccessTokenFromCode(code)
//     const googleUserInfo = await getGoogleUserInfo(access_token)
//   } catch (e) {
//     console.log('ERROR ' + e)
//   }

//   // console.log(googleUserInfo)
//   return res.status(200).json({
//     access_token,
//     googleUserInfo
//   });
// }

// exports.requestGmailAuth = function (req, res, next) {
//   const scopes = ['profile', 'email', 'openid'];

//   let url = googleApi.generateUrl(scopes)
//   res.redirect(url);
// }

// async function registerOrLoginUser(response, res) {
//   const userData = response.data;
//   userData.email = userData.emails[0].value;
//   userData.name = userData.displayName;

//   const newUser = await User.findUserOrRegister(
//     userData.id,
//     userData,
//     'google'
//   );

//   const token = jwt.sign(
//     newUser.id, jwtOptions.secret
//   );

//   res.redirect(`${URL_FRONT}/get-token/${token}`);
// }

// exports.getGmailUserInfo =
//   async function (req, res, next) {
//     const qs = new url.URL(req.url, URL_API).searchParams;
//     let code = qs.get('code');

//     if (!code) {
//       next(new Error('No code provided'))
//     }

//     googleApi.getUserInfo(code)
//     .then(function(response) {
//       registerOrLoginUser(response, res);
//     })
//     .catch(function(e) {
//       console.log('Error Google Api');
//       next(new Error(e.message));
//     })
//   }
