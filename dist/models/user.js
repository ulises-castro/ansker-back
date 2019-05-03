'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose2.default);

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
    // regionCode:  {
    //   type: String,
    //   required: true,
    // },
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

var locations = new _mongoose2.default.Schema({
  ip: {
    type: String
  },
  location: location,
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

var User = _mongoose2.default.model('User', UserSchema);

exports.default = User;