'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var location = {
  type: {
    countryCode: String,
    regionName: String,
    regionCode: String,
    latitude: String,
    longitude: String
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

var userSchema = new _mongoose2.default.Schema({
  username: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: Number,
    default: ''
  },
  // ip: {
  //   type: String,
  //   required: true,
  // },
  ipLogs: [ipsUser],
  registerBy: {
    type: String,
    default: 'facebook'
  },
  authProvider: {
    type: String,
    default: 'facebook'
  },
  authProviders: {
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
  }
});

userSchema.statics.findByLogin = async function (targetUserId) {
  // Search by Provider
  // let user = await this.findOne({
  //   authProviders[provider].id: targetUserId
  // });

  // return user;

  var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'facebook';
};

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;