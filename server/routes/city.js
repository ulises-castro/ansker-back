const express = require('express')
const router = express.Router()

import { getCity } from 'controllers/city'

router.get('/city/:city', getCity)

module.exports = router