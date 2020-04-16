// var proxy = require('express-http-proxy')
const allCities = require('all-the-cities-mongodb')
const countries = require('country-data').countries

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
const city = require('routes/city')


// Load database connection
import { handlerError } from './helpers/error'

import './db'

//Configure our app
var app = express()

// TODO: Fix this
// Documentation
// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./swagger.json')

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const corsOption = {
  origin: true,
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

require('./routes/passport.js')

app.use(passport.initialize())

app.set('trust proxy', true)

// TODO: Adding api prefix instead of adding api in all routes
app.use('/api/auth', auth)
app.use('/api/user', user)

app.use('/api/publication', publication)
app.use('/api/comment', comment)

app.use('/api/searchPlace/city', city)

app.use((err, req, res, next) => {
  handlerError(err, res)
})

export default app