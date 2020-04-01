"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose.default);

var locations = new _mongoose.default.Schema({
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
var UserSchema = new _mongoose.default.Schema({
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
  authProviders
});
UserSchema.plugin(AutoIncrement, {
  inc_field: 'userId'
});

UserSchema.statics.findUserOrRegister = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (targetUserId, userData) {
    var provider = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'facebook';
    var searchBy = "authProviders.".concat(provider, ".id");
    var user = yield this.findOne({
      [searchBy]: targetUserId
    }).exec();

    if (user) {
      // console.log('Finded here and USER', targetUserId, user);
      return user;
    } // REGISTER USER BECAUSE DOESNT EXISTS YET


    var registerAt = new Date(); // Get user geolocation data ########################
    // TODO: Remove file and provider api
    // const userLocation = await getUserLocation(userData.ip);

    var {
      id,
      name,
      email
    } = userData;
    var authProviders = {};
    authProviders[provider] = {
      id,
      name,
      email,
      facebookToken: userData.facebookToken || ''
    };
    var newUser = User({
      // Change facebook to provider
      username: provider + '-' + targetUserId,
      // ip,
      authProviders,
      registerBy: provider,
      registerAt
    });
    return yield newUser.save().then(userCreated => {
      console.log('saved here', userCreated);
      return userCreated;
    });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

UserSchema.statics.updateUserLocation = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (locationData, userId) {
    var _id = userId;
    var user = yield this.findOne({
      _id
    }).exec();
    var {
      coordinates
    } = locationData.location;
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
      return yield user.save().then(location => location);
    }

    return false;
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); // UserSchema.index({ "locations.location" : '2dsphere' });


var User = _mongoose.default.model('User', UserSchema);

var _default = User;
exports.default = _default;