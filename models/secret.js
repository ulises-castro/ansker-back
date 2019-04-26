import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const LikeSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  registerAt: {
    type: Date,
    default: Date.now,
  },
});

const randomAuthorSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  avatar: {
    type: 'String',
    required: true,
    unique: true,
  }
});

const CommentSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  publishAt: {
    type: Date,
    default: Date.now,
  },
});

const ShareSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  registerAt: {
    type: Date,
    default: Date.now,
  },
});

const location = {
  countryCode: {
    type: String,
    required: true,
  },
  regionCode: {
    type: String,
    required: true,
  },
  regionName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    default: '',
  },
  latitude: {
    type: String,
    default: '',
  }
};

const SecretSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 120,
    minLength: 8,
  },
  background: {
    type: 'String',
  },
  backgroundColor: {
    type: 'String',
  },
  fontFamily: {
    type: 'String',
  },
  publishAt: {
    type: Date,
    default: Date.now,
  },
  location,
  likes: [LikeSchema],
  comments: [CommentSchema],
  shares: [ShareSchema],
  commentsAuthors: [randomAuthorSchema],
});

SecretSchema.plugin(AutoIncrement, { inc_field: 'secret_id' });

// SecretSchema.set('toJSON', { getters: true, virtuals: true });
// TODO: implement paginate, scroll infinite
SecretSchema.statics.getAllByCity = async function (countryCode, regionCode, city, done) {

  console.log(countryCode, regionCode, city);
  const secrets = await this.find({
    'location.countryCode' : countryCode,
    'location.regionCode': regionCode,
    'location.city': city
  })
  .select('content backgroundColor publishAt fontFamily comments shares likes')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1 })
  .exec();

  return secrets;
}

// TODO: Next feature to added, added get location by geolocation
SecretSchema.statics.getByNear = function (longitude, latitude, countryCode, state, locality, city, done) {

  this.find({
    'place.countryCode': countryCode,
    'place.city': city,
    'place.state': state,
    'place.locality': locality
  },
  (err, secrets) => {
    done(err, secrets);
  })
  .sort({ longitude: 1, latitude: 1 });

}

module.exports = mongoose.model('Secret', SecretSchema);
