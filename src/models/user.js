import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)

import rug from 'random-username-generator'

import { sendTelegramMsg } from 'helpers'

const locations = new mongoose.Schema({
  ip: {
    type: String,
  },
  countryCode: {
    type: String,
    default: '',
    required: true,
  },
  regionName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
      index: {
        type: '2dsphere',
        sparse: false
      },
    },
  },
  registerAt: {
    type: Date,
    default: Date.now(),
  },
})

const authProviders = {
  type: {
    facebook: {
      type: {
        id: {
          type: String,
          unique: true,
        },
        name: String,
        email: String,
        token: String,
      }
    },
    google: {
      type: {
        id: {
          type: String,
          unique: true,
        },
        name: String,
        email: String,
        token: String,
        verified: Boolean
      }
    },
    twitter: {
      type: {
        id: {
          type: String,
          unique: true,
        },
        name: String,
        email: String,
        token: String,
      }
    },
  }
}

const settings = {
  type: {
    language: {
      type: String,
      enum: ['es-latam', 'en-us']
    },
  }
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  desactivated: {
    type: Boolean,
    default: false,
  },
  ip: {
    type: String,
  },
  locations: [locations],
  registerAt: {
    type: Date,
    default: Date.now()
  },
  registerBy: {
    type: String,
    enum: ['facebook', 'google', 'local'],
  },
  authProvider: {
    type: String,
    enum: ['facebook', 'google', 'local'],
  },
  settings,
  authProviders,
})

UserSchema.plugin(AutoIncrement, {
  inc_field: 'userId'
})

UserSchema.statics.findUserOrRegister =
  async function (userData, provider = 'facebook'
  ) {
    const searchBy = `authProviders.${provider}.id`
    const targetUserId = userData.id

    let user = await this.findOne({
      [searchBy]: targetUserId
    }).exec()

    if (user) {
      sendTelegramMsg(`El usuario ${user.username} se ha logeado.`)

      return user
    }

    const registerAt = new Date()

    const {
      id,
      ip,
      name,
      email,
      token,
      verified,
    } = userData

    let authProviders = {}

    authProviders[provider] = {
      id,
      ip,
      name,
      email,
      token,
      verified
    }

    const current_time = new Date().getTime()

    let newUser = User({
      ip,
      email,
      username: rug.generate() + current_time,
      authProviders,
      registerBy: provider,
      registerAt,
    })

    return await newUser.save().then((userCreated) => {
      sendTelegramMsg('NUEVO USUARIO - Total: \n ' + userCreated.userId)

      return userCreated
    })
  }

// TODO: Check V1 ================ For nearby function
UserSchema.statics.updateUserLocation =
  async function (locationData, userId) {
    const _id = userId
    const user = await this.findOne({
      _id
    }).exec()

    const {
      coordinates
    } = locationData.location

    let isSameLocation = false
    if (user.locations && user.locations.length) {
      const userFormated = user.toObject()
      const lastLocation = userFormated.locations.length - 1

      const isNewLocation = userFormated.locations[lastLocation]
      isSameLocation = (
        isNewLocation[1] === coordinates[1] &&
        isNewLocation[0] === coordinates[0]
      )
    }

    if (!isSameLocation) {
      user.locations.push(locationData)
      return await user.save().then(location => location)
    }

    return false
  }

// UserSchema.index({ "locations.location" : '2dsphere' })
const User = mongoose.model('User', UserSchema)

export default User
