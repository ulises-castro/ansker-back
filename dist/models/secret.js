'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose2.default);
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

var randomAuthorSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  avatar: {
    type: 'String',
    required: true
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
    minLength: 5
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
  shares: [ShareSchema],
  commentsAuthors: [randomAuthorSchema]
});

SecretSchema.plugin(AutoIncrement, { inc_field: 'secretId' });
LikeSchema.plugin(AutoIncrement, { inc_field: 'likeId' });
CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

// SecretSchema.set('toJSON', { getters: true, virtuals: true });
// TODO: implement paginate, scroll infinite
SecretSchema.statics.getAllByCity = async function (countryCode, regionCode, city, done) {

  console.log(countryCode, regionCode, city);
  var secrets = await this.find({
    'location.countryCode': countryCode,
    'location.regionCode': regionCode,
    'location.city': city
  }).select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt')
  // .skip(2)
  .limit(20).sort({ publishAt: -1 }).exec();

  return secrets;
};

// TODO: Verify secret was send from same user's location.
SecretSchema.statics.setLiked = async function (secretId, author) {

  console.log(secretId, "Holaaa");
  var like = await this.findOne({ secretId: secretId }).exec();
  like.likes.push({ author: author });

  return await like.save().then(function (like) {
    return like;
  });
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