'use strict'
import to from 'await-to-js'
import axios from 'axios'

import { ErrorHandler } from 'helpers/error'

import User from 'models/user'
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

let fbUrl = 'https://graph.facebook.com'

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD

const joinOrLoginFacebook = async (facebookToken, req, res, next) => {
  //TODO: Break into chucks of code this
  // Get AppToken ###########################
  const client_id = process.env.FACEBOOK_CLIENT_ID
  const client_secret = process.env.FACEBOOK_CLIENT_SECRET

  let appToken
  let url = `${fbUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`

  const [errAccess, accessToken] = await to(axios.get(url))

  if (errAccess) {
    console.log(errAccess)
    throw new ErrorHandler('400', 'Ocurrió un error intentalo más tarde')
  }

  appToken = accessToken.data.access_token

  // Checking appToken #########################
  url = `${fbUrl}/debug_token?input_token=${facebookToken}&access_token=${appToken}`

  const [errAppFacebookData, appFacebookData] = await to(axios.get(url))

  if (errAppFacebookData) {
    throw ErrorHandler('400', 'Ocurrió un error intentalo más tarde')
  }

  const ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  const {
    app_id,
    user_id,
  } = appFacebookData.data.data

  if (app_id !== client_id) {
    throw new Error(
      `Invalid app id: expected: app_id received ${app_id} instead of: ${client_id}`
    )
  }

  // It's okay, get user information #############
  url = `${fbUrl}/v3.2/${user_id}?fields=id,name,picture,email&access_token=${appToken}`

  // TODO: Creater catch error handler. ###################
  let [errFacebookUser, facebookUserData] = await to(axios.get(url))

  if (errFacebookUser) throw ErrorHandler('400', 'Ocurrió un error intentalo más tarde')

  // TODO: Refactor this
  facebookUserData = facebookUserData.data
  facebookUserData.ip = ipUser
  facebookUserData.provider = 'facebook'
  facebookUserData.token = facebookToken
  facebookUserData.email = facebookUserData.email
  facebookUserData.verified_email = true

  registerOrLoginUser(facebookUserData, res, next)
}

async function loginFacebook  (req, res, next) {
  const { tokenFB } = req.body

  let payload = {
    tokenFB
  }

// Find User via Facebook || Register if user doesn't exists in database
  const [err, facebookData] = await to(joinOrLoginFacebook(payload.tokenFB, req, res, next))

  //Get last posit[ion
  // TODO: Get clear this code and break into chunks of code and files.
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

    console.log(err, 'err ')

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

  // console.log(googleInfoByTokenData) // { id, email, given_name, family_name }

  // console.log(err)

  if (err) next(err)
  const { data } = googleInfoByTokenData

  data.token = access_token
  data.provider = 'google'

  data.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  registerOrLoginUser(data, res, next)
}

async function registerOrLoginUser(userData, res, next) {
  userData.verified = userData.verified_email

  const [err, newUser] = await to(User.findUserOrRegister(
    userData,
    userData.provider
  ))

  if (err) next(err)

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