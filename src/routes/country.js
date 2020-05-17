const express = require('express')
const router = express.Router()

import { getCity, getCountry } from 'controllers/country'

router.get('/city/:city', getCity)

router.get('/country/:country', getCountry)

module.exports = router