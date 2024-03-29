const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const passport = require('passport')
const cors = require('cors')

// Routes
const auth = require('routes/auth')
const publication = require('routes/publication')
const comment = require('routes/comment')
const user = require('routes/user')
const device = require('routes/device')
const country = require('routes/country')

// Load database connection
import { handlerError } from './helpers/error'

import './db'

//Configure our app
var app = express()

const corsOption = {
  origin: process.env.URL_FRONT,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  exposedHeaders: ['Authorization']
}

app.use(cors(corsOption))

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.set('trust proxy', true)

app.use(passport.initialize())

require('./routes/passport.js')

// TODO: Adding api prefix instead of adding api in all routes
app.use('/v1/auth', auth)
app.use('/v1/user', user)
app.use('/v1/device', device)

app.use('/v1/publication', publication)
app.use('/v1/publication/comment', comment)

app.use('/v1/searchPlace', country)

app.use((err, req, res, next) => {
  handlerError(err, res)
})

export default app