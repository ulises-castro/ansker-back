const mongoose = require('mongoose')

let uri = `mongodb://srv-captain--ansker-mongodb/ansker`

let customOptions = {
  authSource: 'admin',
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PWD,
  autoIndex: false,
}

if (process.env.NODE_ENV === 'development') {
  uri = 'mongodb://0.0.0.0:27017/ansker'

  customOptions = {
    autoIndex: true,
  }
}

const options = {
  ...customOptions,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}

mongoose.connect(uri, options).then(() => {
  console.log('Connected to Database')
}).catch(error => {
  console.log('There is a problem with database', error)
})
