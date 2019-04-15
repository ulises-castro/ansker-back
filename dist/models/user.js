'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ips = new _mongoose2.default.Schema({
  ip: {
    type: String,
    required: true
  },
  registerAt: {
    type: Date,
    required: true
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
  ip: {
    type: {
      lat: {
        type: String
      },
      long: {
        type: String
      },
      lastUpdated: {
        type: Date
      }
    }
  },
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
  },
  ips: [ipsUser]
});

userSchema.statics.findByLogin = async function (facebookId) {
  var user = await this.findOne({
    facebookId: facebookId
  });

  return user;
};

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;