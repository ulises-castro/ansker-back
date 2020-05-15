

const passport = require('passport')
const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')

var ExtractJwt = passportJWT.ExtractJwt
var JwtStrategy = passportJWT.Strategy

import User from '../models/user'
// Configuration

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET_PASSWORD

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {

  console.log("Holaaa")

  User.findOne({ '_id': jwt_payload }, function(err, user) {
    console.log('Aqui entro, payload', jwt_payload, user)

    if (err) {
      done(err, false)
    }

    const userData = user
    if (user && user.locations.length) {
      console.log(user, 'Userdata')
      const lastLocation = userData.locations.length - 1
      let location = userData.locations[lastLocation]
      userData.location = location.location
    }

    done(null, userData)
  })
})

passport.use(strategy)
