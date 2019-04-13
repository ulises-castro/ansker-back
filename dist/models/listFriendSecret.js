'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema.Schema;


var LikeSchema = new Schema({
  authorId: {
    type: String,
    index: true,
    required: true
  },
  registerAt: {
    type: Date,
    default: Date.now
  }
});

var CommentSchema = new Schema({
  authorId: {
    type: String,
    index: true,
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
  authorId: {
    type: String,
    index: true,
    required: true
  },
  registerAt: {
    type: Date,
    default: Date.now
  }
});

var SecretSchema = new Schema({
  authorId: {
    type: String,
    index: true,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 200,
    minLength: 2
  },
  latitude: {
    type: String,
    index: true,
    required: true
  },
  longitude: {
    type: String,
    index: true,
    required: true
  },
  place: {
    countryCode: {
      type: String,
      index: true,
      required: true
    },
    region: {
      type: String,
      index: true,
      required: true
    },
    locality: {
      type: String,
      index: true,
      required: true
    },
    city: {
      type: String,
      index: true,
      required: true
    },
    metropolitanArea: String
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  likes: [LikeSchema],
  comments: [CommentSchema],
  shares: [ShareSchema]
});

// SecretSchema.set('toJSON', { getters: true, virtuals: true });

SecretSchema.statics.getByCity = async function (countryCode, state, city, done) {

  this.find({}).where('place.countryCode').equals(countryCode).where('place.state').equals(state).where('place.city').equals(city).exec(function (err, secrets) {
    done(err, secrets);
  });
};

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

module.exports = db.model('Secret', SecretSchema);