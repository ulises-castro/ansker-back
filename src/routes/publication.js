const express = require('express')
const router = express.Router()

const passport = require('passport')

import { getAllByCity, getAll, getPublication, voteUp, publish } from 'controllers/publication'

router.post('/publish', passport.authenticate('jwt', {
  session: false,
}), publish)

router.post('/voteUp', passport.authenticate('jwt', {
  session: false,
}), voteUp)

router.get('/:publicationId', passport.authenticate('jwt', {
  session: false,
}), getPublication)

router.get('/filter/:countryCode/:city/:pageNumber', getAllByCity)

router.get('/filter/all/:pageNumber', getAll)

module.exports = router