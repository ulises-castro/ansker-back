'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose2.default);

var locations = new _mongoose2.default.Schema({
  ip: {
    type: String
  },
  countryCode: {
    type: String,
    default: '',
    required: true
  },
  regionName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  registerAt: {
    type: Date,
    default: Date.now()
  }
});

var authProviders = {
  type: {
    facebook: {
      type: {
        id: {
          type: String,
          unique: true
        },
        name: String,
        email: String,
        token: String
      }
    },
    google: {
      type: {
        id: {
          type: String,
          unique: true
        },
        name: String,
        email: String,
        token: String
      }
    },
    twitter: {
      type: {
        id: {
          type: String,
          unique: true
        },
        name: String,
        email: String,
        token: String
      }
    },
    email: {
      type: String
    }
  }
};

var UserSchema = new _mongoose2.default.Schema({
  username: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: Number,
    default: ''
  },
  // Saved all ips
  locations: [locations],
  registerBy: {
    type: String,
    default: 'facebook'
  },
  authProvider: {
    type: String,
    default: 'facebook'
  },
  authProviders: authProviders
});

UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

UserSchema.statics.findUserOrRegister = async function (targetUserId, userData) {
  var provider = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'facebook';


  var user = await this.findOne({
    'authProviders.facebook.id': targetUserId
  }).exec();

  if (user) {
    // console.log('Finded here and USER', targetUserId, user);
    return user;
  }

  // REGISTER USER BECAUSE DOESNT EXISTS YET

  var registerAt = new Date();

  // Get user geolocation data ########################
  // TODO: Remove file and provider api
  // const userLocation = await getUserLocation(userData.ip);

  var id = userData.id,
      name = userData.name,
      email = userData.email,
      facebookToken = userData.facebookToken;


  var newUser = User({
    // Change facebook to provider
    username: 'facebook-' + targetUserId,
    // ip,
    // Added more authProvider (Google | Twitter);
    authProviders: {
      facebook: {
        id: id,
        name: name,
        email: email,
        // TODO Create a function which performences update facebooktoken when user had been signed
        token: facebookToken
      }
    },
    registerAt: registerAt
  });

  return await newUser.save().then(function (userCreated) {
    console.log('saved here', userCreated);
    return userCreated;
  });
};

UserSchema.statics.updateUserLocation = async function (locationData, userId) {
  var _id = userId;
  var user = await this.findOne({ _id: _id }).exec();

  var coordinates = locationData.location.coordinates;


  console.log(locationData);

  var isSameLocation = false;
  if (user.locations && user.locations.length) {
    var userFormated = user.toObject();
    var lastLocation = userFormated.locations.length - 1;
    console.log(userFormated.locations[0], lastLocation);

    var isNewLocation = userFormated.locations[lastLocation];
    isSameLocation = isNewLocation[1] === coordinates[1] && isNewLocation[0] === coordinates[0];
  }

  if (!isSameLocation) {
    user.locations.push(locationData);
    return await user.save().then(function (location) {
      return location;
    });
  }

  return false;
};

// UserSchema.index({ "locations.location" : '2dsphere' });
var User = _mongoose2.default.model('User', UserSchema);

exports.default = User;