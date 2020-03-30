'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
      default: [0, 0],
      index: {
        type: '2dsphere',
        sparse: false
      }
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
        email: String
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
    enum: ['facebook', 'google', 'local']
  },
  authProvider: {
    type: String,
    enum: ['facebook', 'google', 'local']
  },
  authProviders: authProviders
});

UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

UserSchema.statics.findUserOrRegister = async function (targetUserId, userData) {
  var provider = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'facebook';


  var searchBy = 'authProviders.' + provider + '.id';

  var user = await this.findOne(_defineProperty({}, searchBy, targetUserId)).exec();

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
      email = userData.email;


  var authProviders = {};

  authProviders[provider] = {
    id: id,
    name: name,
    email: email,
    facebookToken: userData.facebookToken || ''
  };

  var newUser = User({
    // Change facebook to provider
    username: provider + '-' + targetUserId,
    // ip,
    authProviders: authProviders,
    registerBy: provider,
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