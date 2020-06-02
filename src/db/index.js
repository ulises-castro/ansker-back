const mongoose = require('mongoose')

let uri = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PWD}@srv-captain--ansker-mongodb/ansker?authSource=admin`

let customOptions = {
  useMongoClient: true,
  autoIndex: false,
}

if (process.env.NODE_ENV === 'development') {
  uri = 'mongodb://0.0.0.0:27017/ansker'

  customOptions = {
    autoIndex: true,
    useNewUrlParser: true,
  }
}

const options = {
  // authSource: 'admin',
  // user: process.env.DATABASE_USER,
  // pass: process.env.DATABASE_PWD,
  ...customOptions,
  useCreateIndex: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
  // reconnectTries: 30,
  // reconnectInterval: 500, // in ms
}

mongoose.connect(uri, options).then(() => {
  console.log('Connected to Database')
}).catch(error => {
  console.log('There is a problem with database', error)
})
