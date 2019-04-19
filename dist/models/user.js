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
      default: '',
      required: true
    },
    city: {
      type: String,
      required: true
    },
    regionName: {
      type: String,
      required: true
    },
    regionCode: {
      type: String,
      required: true
    },
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
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

userSchema.statics.findUserOrRegister = async function (targetUserId, userData) {
  var provider = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'facebook';


  var user = await this.findOne({
    'authProviders.facebook.id': targetUserId
  }).exec();

  if (user) {
    console.log('Finded here and USER', targetUserId, user);
    return targetUserId;
  }

  console.log(targetUserId, userData, user, targetUserId, "Mirame en el modelo");

  // REGISTER USER BECAUSE DOESNT EXISTS YET

  var registerAt = new Date();
  var _userData$location = userData.location,
      ip = _userData$location.ip,
      city = _userData$location.city,
      country_code = _userData$location.country_code,
      region_name = _userData$location.region_name,
      region_code = _userData$location.region_code,
      latitude = _userData$location.latitude,
      longitude = _userData$location.longitude;
  var id = userData.id,
      name = userData.name,
      email = userData.email,
      facebookToken = userData.facebookToken;


  var newUser = User({
    username: targetUserId,
    // ip,
    ipLogs: {
      ip: ip,
      location: {
        countryCode: country_code,
        regionName: region_name,
        regionCode: region_code,
        city: city,
        latitude: latitude,
        longitude: longitude
      }
    },
    // authProvider TODO: Facebook is only way to get access
    authProviders: {
      facebook: {
        id: id,
        name: name,
        email: email,
        token: facebookToken
      }
    },
    registerAt: registerAt
  });

  newUser.save().then(function (value) {
    console.log('saved here', targetUserId);
    return targetUserId;
  });
};

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;