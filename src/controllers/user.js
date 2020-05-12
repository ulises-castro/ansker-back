'use strict'
import to from 'await-to-js'
import axios from 'axios'

import User from 'models/user'

const jwt = require('jsonwebtoken')
const jwtOptions = {}

jwtOptions.secret = process.env.JWT_SECRET_PASSWORD

export {
}