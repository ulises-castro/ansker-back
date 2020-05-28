const express = require('express')
const router = express.Router()

const passport = require('passport')

import {
  publish
} from 'controllers/comment'

router.post(
  '/publish',
  passport.authenticate('jwt', {
    session: false
  }),
  publish
)

module.exports = router
