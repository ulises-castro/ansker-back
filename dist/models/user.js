'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var location = {
  type: {
    countryCode: {
      type: String,
      default: ''
    },
    regionName: {
      type: String,
      default: ''
    },
    regionCode: {
      type: String,
      default: ''
    },
    latitude: {
      type: String,
      default: ''
    },
    longitude: {
      type: String,
      default: ''
    }
  }
};

var ipsUser = new _mongoose2.default.Schema({
  ip: {
    type: String,
    required: true
  },
  location: location,
  registerAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

var authProviders = {
  type: {
    facebook: {
      type: {
        id: String,
        name: String,
        email: String,
        token: String
      }
    },
    google: {
      type: {
        id: String,
        name: String,
        email: String,
        token: String
      }
    },
    twitter: {
      type: {
        id: String,
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

var userSchema = new _mongoose2.default.Schema({
  username: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: Number,
    default: ''
  },
  // Saved all ips
  ipLogs: [ipsUser],
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

userSchema.statics.findByLogin = async function (targetUserId) {
  // Search by Provider
  // let user = await this.findOne({
  //   authProviders[provider].id: targetUserId
  // });

  // return user;

  var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'facebook';
};

userSchema.statics.findUserOrRegister = async function (targetUserId, userGeolocationData) {
  var provider = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'facebook';


  var registerAt = new Date();
  var ip = userGeolocationData.ip,
      country_code = userGeolocationData.country_code,
      region_name = userGeolocationData.region_name,
      region_code = userGeolocationData.region_code,
      latitude = userGeolocationData.latitude,
      longitude = userGeolocationData.longitude,
      id = userGeolocationData.id,
      name = userGeolocationData.name,
      facebookToken = userGeolocationData.facebookToken;


  var newUser = User({
    username: targetUserId,
    // ip,
    ipLogs: {
      ip: ipUser,
      location: {
        countryCode: country_code,
        regionName: region_name,
        regionCode: region_code,
        latitude: latitude,
        longitude: longitude
      }
    },
    // authProvider TODO: Facebook is only way to get access
    authProviders: {
      facebook: {
        id: id,
        name: name,
        email: '',
        token: facebookToken
      }
    },
    registerAt: registerAt
  });

  return await newUser.save();
};

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;