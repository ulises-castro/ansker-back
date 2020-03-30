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
    index: true,
  },
  avatar: {
    type: Number,
    required: true,
    index: true,
  },
  backgroundColor: {
    type: 'String',
  },
});

const CommentSchema = new Schema({
  commentId: {
    type: ObjectId,
    ref: 'Comment',
    required: true,
    index: true,
  },
});

const ShareSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true,
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
  regionName: {
    type: String,
    required: true,
    index: true,
  },
  city: {
    type: String,
    required: true,
    index: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  }
};

const SecretSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 120,
    minLength: 5,
    trim: true,
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

SecretSchema.plugin(AutoIncrement, { inc_field: 'secretId' });
LikeSchema.plugin(AutoIncrement, { inc_field: 'likeId' });
// CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

// SecretSchema.set('toJSON', { getters: true, virtuals: true });
// TODO: implement paginate, scroll infinite
SecretSchema.statics.getAllByNear =
async function (longitude, latitude) {
  console.log(longitude, latitude);
  const secrets = await this.find({
    "location.location": {
      $near: {
        $geometry: {
            type: "Point" ,
            coordinates: [ longitude, latitude ]
        },
        $maxDistance: 5000,
        $minDistance: 0,
      },
    },
  })
  .select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1, })
  .lean()
  .exec();

  return secrets;
}

import isoCountryCodeConverter from '../services/convertCountryCodes';
console.log();


SecretSchema.statics.getAllByNear =
async function (longitude, latitude) {
  console.log(longitude, latitude);
  const secrets = await this.find({
    "location.location": {
      $near: {
        $geometry: {
            type: "Point" ,
            coordinates: [ longitude, latitude ]
        },
        $maxDistance: 5000,
        $minDistance: 0,
      },
    },
  })
  .select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1, })
  .lean()
  .exec();

  return secrets;
}

SecretSchema.statics.getAllByCity =
async function (countryCode, city) {
  
  // Adapting searching to searched
  countryCode = countryCode.toUpperCase();
  countryCode = isoCountryCodeConverter.convertTwoDigitToThree(countryCode);
  console.log(countryCode, city);
  
  const secrets = await this.find(
    {
      "location.countryCode": countryCode,
      "location.city": city,
    },
  )
  .select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1, })
  .lean()
  .exec();

  return secrets;
}

// ##### LIKE SYSTEM ############
// TODO: Verify secret was send from same user's location.
SecretSchema.statics.setLiked =
async function (secretId, author) {
  console.log(secretId, "Holaaa");
  const like = await this.findOne({ secretId }).exec();

  // Change find method for an FindOne, this is useless
  // secret.likes.findOne
  const likeFormated = like.toObject();
  const userLike = likeFormated.likes
    .find(like => `${like.author}` == author);

    // console.log(userLike,"userlike", likeFormarted, (like.likes[0].author == author), author)
  let rest = false;
  if (userLike) {
    like.likes.id(userLike._id).remove();
    rest = true;
  } else {
    like.likes.push({ author });
  }

  return await like.save().then(like => {
    // TODO: check this, return only like, rest is useless now
    return [like, rest];
  });
}

// SecretSchema.index({ "location.location.coordinates": "2dsphere" });
// db.secrets.createIndex({"location.location": "2dsphere"})

module.exports = mongoose.model('Secret', SecretSchema);
