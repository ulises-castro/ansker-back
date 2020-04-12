'use strict'
import to from 'await-to-js'
import axios from 'axios'

import User from 'models/user'

const jwt = require('jsonwebtoken')
const jwtOptions = {}

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD

const getGoogleInfo = async (req, res, next) => {
  const {
    access_token
  } = req.query

  const [ err, googleInfoData ] = await to(axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }))
  console.log(googleInfoData) // { id, email, given_name, family_name }

  console.log(err)

  if (err) next(err)
  const { data } = googleInfoData

  data.token = access_token

  data.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  registerOrLoginUser(data, res, next)
}

async function registerOrLoginUser(userData, res, next) {
  userData.verified = userData.verified_email

  const [err, newUser] = await to(User.findUserOrRegister(
    userData,
    'google'
  ))

  if (err) next(err)

  console.log(err, newUser)

  const token = jwt.sign(
    newUser.id, jwtOptions.secret
  )

  res.status(200).json({
    token
  })
}

const getAccessTokenFromCode = async (req, res, next) => {
  const {
    code
  } = req.query

  const [ err, googleAuthData ] = await to(axios({
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

    // console.log(googleAuthData)
    if (googleAuthData) {
      const { data } = googleAuthData

      res.status(200).json({
        ...data
      })
    }
    // console.log(data, err)
    next(err)
}

export {
  getGoogleInfo,
  getAccessTokenFromCode,
}