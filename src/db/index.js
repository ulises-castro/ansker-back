

const mongoose = require('mongoose')

// const uri = 'mongodb://587f9fd4b7b2:27017/ansker'
// const uri = 'mongodb://0.0.0.0:27017/ansker'

const uri = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PWD}@srv-captain--ansker-mongodb/ansker?authSource=admin`

const autoIndex = (process.env.NODE_ENV === 'development')

// Defining vars to connect to database
const options = {
  // authSource: 'admin',
  // user: process.env.DATABASE_USER,
  // pass: process.env.DATABASE_PWD,
  useMongoClient: true,
  // useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
  // reconnectTries: 30,
  // reconnectInterval: 500, // in ms
}

mongoose.connect(uri, options).then(() => {
  console.log('connected to database')
}).catch(error => {
  console.log('There is a problem with database', error)
})
