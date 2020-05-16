import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const LikeSchema = new Schema({
  authorId: {
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
  authorId: {
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
  authorId: {
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
  // regionName: {
  //   type: String,
  //   required: true,
  //   index: true,
  // },
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

const fontContent = {
  color: {
    type: 'String',
  },
  family: {
    type: 'String',
  },
}

const PublicationSchema = new Schema({
  authorId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 180,
    minLength: 10,
    trim: true,
  },
  // TODO: Check in future updates is this will workss
  backgroundImage: {
    type: 'String',
    required: false,
  },
  backgroundColor: {
    type: 'String',
    required: false,
  },
  fontContent,
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

PublicationSchema.plugin(AutoIncrement, { inc_field: 'publicationId' });
LikeSchema.plugin(AutoIncrement, { inc_field: 'likeId' });
// CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

// PublicationSchema.set('toJSON', { getters: true, virtuals: true });
// TODO: implement paginate, scroll infinite
PublicationSchema.statics.getAllByNear =
async function (longitude, latitude) {
  const publications = await this.find({
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
  .select('content backgroundColor publishAt fontFamily comments shares likes publicationId likes.registerAt likes.author')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1, })
  .lean()
  .exec();

  return publications;
}
import isoCountryCodeConverter from '../services/convertCountryCodes';

PublicationSchema.statics.getAllByNear =
async function (longitude, latitude) {
  console.log(longitude, latitude);
  const publications = await this.find({
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
  .select('content backgroundColor publishAt fontFamily comments shares likes publicationId likes.registerAt likes.author')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1, })
  .lean()
  .exec();

  return publications;
}

PublicationSchema.statics.getAllByCity =
async function (countryCode, city) {

  // Adapting searching to searched
  // TODO: Check this I'm no sure about this
  // countryCode = countryCode.toUpperCase();
  // countryCode = isoCountryCodeConverter.convertTwoDigitToThree(countryCode);

  const publications = await this.find(
    {
      "location.countryCode": countryCode,
      "location.city": city,
    },
  )
  .select('content backgroundColor publishAt fontFamily comments shares likes publicationId likes.registerAt likes.author')
  // .skip(2)
  .limit(20)
  .sort({ publishAt: -1, })
  .lean()
  .exec();

  return publications;
}

// ##### LIKE SYSTEM ############ 
// TODO: Verify publication was send from same user's location. - OLD VERSION
// TODO: https://trello.com/c/lxxAEyYr/33-up-down-system-just-thinking-about-it 
PublicationSchema.statics.setLiked =
async function (publicationId, author) {
  const like = await this.findOne({ publicationId }).exec();

  // Change find method for an FindOne, this is useless
  // publication.likes.findOne
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

// PublicationSchema.index({ "location.location.coordinates": "2dsphere" });
// db.publications.createIndex({"location.location": "2dsphere"})

module.exports = mongoose.model('Publication', PublicationSchema);
