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
    required: true,
    index: true
  },
  avatar: {
    type: Number,
    required: true,
    index: true
  },
  backgroundColor: {
    type: 'String'
  }
});

var CommentSchema = new Schema({
  commentId: {
    type: ObjectId,
    ref: 'Comment',
    required: true,
    index: true
  }
});

var ShareSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
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
  regionName: {
    type: String,
    required: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
};

var SecretSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 120,
    minLength: 5,
    trim: true
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
// CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

// SecretSchema.set('toJSON', { getters: true, virtuals: true });
// TODO: implement paginate, scroll infinite
SecretSchema.statics.getAllByCity = async function (longitude, latitude) {
  console.log(longitude, latitude);
  var secrets = await this.find({
    "location.location": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        $maxDistance: 1000000,
        $minDistance: 0
      }
    }
  })
  // .select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author')
  // .skip(2)
  .limit(20).lean().exec();

  return secrets;
};

// ##### LIKE SYSTEM ############
// TODO: Verify secret was send from same user's location.
SecretSchema.statics.setLiked = async function (secretId, author) {
  console.log(secretId, "Holaaa");
  var like = await this.findOne({ secretId: secretId }).exec();

  // Change find method for an FindOne, this is useless
  // secret.likes.findOne
  var likeFormated = like.toObject();
  var userLike = likeFormated.likes.find(function (like) {
    return '' + like.author == author;
  });

  // console.log(userLike,"userlike", likeFormarted, (like.likes[0].author == author), author)
  var rest = false;
  if (userLike) {
    like.likes.id(userLike._id).remove();
    rest = true;
  } else {
    like.likes.push({ author: author });
  }

  return await like.save().then(function (like) {
    // TODO: check this, return only like, rest is useless now
    return [like, rest];
  });
};

// TODO: Next feature to added, added get location by geolocation
// SecretSchema.statics.getByNear = function (longitude, latitude, countryCode, state, locality, city, done) {
//
//   this.find({
//     'place.countryCode': countryCode,
//     'place.city': city,
//     'place.state': state,
//     'place.locality': locality
//   },
//   (err, secrets) => {
//     done(err, secrets);
//   })
//   .sort({ longitude: 1, latitude: 1 });
//
// }

module.exports = _mongoose2.default.model('Secret', SecretSchema);