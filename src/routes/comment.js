const express = require('express')
const router = express.Router()

const passport = require('passport')

import {
  publish,
  getAll
} from 'controllers/comment'

router.post(
  '/publish',
  passport.authenticate('jwt', {
    session: false
  }),
  publish
)

router.get('/getAll/:publicationId', getAll)

module.exports = router
