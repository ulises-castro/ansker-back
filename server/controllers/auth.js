'use strict'
import to from 'await-to-js'
import axios from 'axios'

import User from 'models/user'
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD

import joinOrLoginFacebook from 'auth/facebook-auth.js'

async function loginFacebook  (req, res, next) {
  const { tokenFB } = req.body

  let payload = {
    tokenFB
  }

  const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress

// Find User via Facebook || Register if user doesn't exists in database
  const [err, facebookData] = await to(joinOrLoginFacebook(payload.tokenFB))

  //Get last posit[ion
  // TODO: Get clear this code and break into chunks of code and files.
  console.log(facebookData, "facebookDataEEEEE")

  if (err) {
    return res.status(400).json({
      token: false,
      message: 'No pudimos procesar tu solicitud, intentalo más tarde',
    })
  }

  const userData = {}
  // const isUserNew = facebookData.isNew
  userData.facebookId = facebookData.authProviders.facebook.id
  userData.id = `${facebookData._id}`

  // Returned respones based on facebookData value
  if (facebookData && facebookData._id) {
    const token = jwt.sign(userData.id, jwtOptions.secret)

    return res.status(200).json({
      token: token,
      status: true,
    })
  }

  return res.status(403).json({
    token: false,
    message: 'No pudimos concretar la peticion con Facebook, por favor intentalo más tarde',
  })
}

const loginGoogle = async (req, res, next) => {
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

    next(err)
}


const googleInfoByToken = async (req, res, next) => {
  const {
    access_token
  } = req.query

  const [ err, googleInfoByTokenData ] = await to(axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }))

  console.log(googleInfoByTokenData) // { id, email, given_name, family_name }

  console.log(err)

  if (err) next(err)
  const { data } = googleInfoByTokenData

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

export {
  loginFacebook,
  loginGoogle,
  googleInfoByToken,
}