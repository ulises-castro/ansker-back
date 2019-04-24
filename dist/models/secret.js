'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var ObjectId = _mongoose2.default.Schema.Types.ObjectId;

var LikeSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  registerAt: {
    type: Date,
    default: Date.now
  }
});

var CommentSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  publishAt: {
    type: Date,
    default: Date.now
  }
});

var ShareSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  registerAt: {
    type: Date,
    default: Date.now
  }
});

var location = {
  countryCode: {
    type: String,
    required: true
  },
  regionCode: {
    type: String,
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
  longitude: {
    type: String,
    default: ''
  },
  latitude: {
    type: String,
    default: ''
  }
};

var SecretSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 120,
    minLength: 8
  },
  background: {
    type: 'String'
  },
  backgroundColor: {
    type: 'String'
  },
  fontFamily: {
    type: 'String'
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  location: location,
  likes: [LikeSchema],
  comments: [CommentSchema],
  shares: [ShareSchema]
});

// SecretSchema.set('toJSON', { getters: true, virtuals: true });

SecretSchema.statics.getByCity = async function (countryCode, regionCode, city, done) {

  var secrets = this.find({}).where('place.countryCode').equals(countryCode).where('place.regionCode').equals(regionCode).where('place.city').equals(city).exec();

  return secrets;
};

// TODO: Next feature to added, added get location by geolocation
SecretSchema.statics.getByNear = function (longitude, latitude, countryCode, state, locality, city, done) {

  this.find({
    'place.countryCode': countryCode,
    'place.city': city,
    'place.state': state,
    'place.locality': locality
  }, function (err, secrets) {
    done(err, secrets);
  }).sort({ longitude: 1, latitude: 1 });
};

module.exports = _mongoose2.default.model('Secret', SecretSchema);