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

// Load database connection
import { ErrorHandler, handlerError } from './helpers/error'

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
app.use('/api/publication', publication)
app.use('/api/comment', comment)
app.use('/api/user', user)

// TODO: Refactor this and create its controller to keep dry code
//Get cities by name
app.get('/api/searchPlace/:city', function (req, res) {

  let {
    city
  } = req.params
  city = city.toLowerCase()
  // return console.log(req.params)

  let cities = allCities.filter(cityCurrent => {
    if (
      cityCurrent.name.toLowerCase().match(city)
    ) {
      const countryData = countries[cityCurrent.country]
      cityCurrent.countryName = countryData.name
      cityCurrent.flag = countryData.emoji
      return cityCurrent
    }
  })

  cities = cities.sort((a, b) => {
    if (a.population > b.population)
      return -1
    else if (b.population > a.population)
      return 1
    else
      return 0
  })

  // cities = cities.sort((a, b) => {
  //   if (a.country === 'MX' && b.country !== 'MX')
  //     return -1
  //   else if (a.country !== 'MX' && b.country === 'MX')
  //     return 1
  //   else
  //     return 0
  // })

  cities = cities.slice(0, 5)

  return res.status(200).json({
    cities,
  })
})

app.use((err, req, res, next) => {
  handlerError(err, res)
})

export default app