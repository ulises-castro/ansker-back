import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)
const { Schema } = mongoose

const ObjectId = mongoose.Schema.Types.ObjectId

const votesSchema = new Schema({
  authorId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  up: {
    type: Boolean,
    default: true,
  },
  registerAt: {
    type: Date,
    default: Date.now,
  },
})

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
})

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
})

const location = {
  countryCode: {
    type: String,
    required: true,
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
}

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
  votes: [votesSchema],
  shares: [ShareSchema],
  commentsAuthors: [randomAuthorSchema],
})

PublicationSchema.plugin(AutoIncrement, { inc_field: 'publicationId' })
votesSchema.plugin(AutoIncrement, { inc_field: 'vodeId' })

// TODO: implement paginate, scroll infinite
PublicationSchema.statics.getAllByNear =
  async function (longitude, latitude) {
    const publications = await this.find({
      "location.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000,
          $minDistance: 0,
        },
      },
    })
      .select('content backgroundColor publishAt fontFamily comments shares votes publicationId votes.registerAt votes.authorId')
      // .skip(2)
      .limit(20)
      .sort({ publishAt: -1, })
      .lean()
      .exec()

    return publications
  }

PublicationSchema.statics.getBy =
  async function (searchBy = {}, pageNumber = 1) {
    const skip = (pageNumber - 1) * 2
    const limit = 2

    const publications = await this.find(searchBy, pageNumber)
      .select('content backgroundColor publishAt location.city fontFamily comments shares votes publicationId votes.registerAt votes.authorId')
      .skip(skip)
      .limit(limit)
      .sort({ publishAt: -1, })
      .lean()
      .exec()

    return publications
  }

// ##### LIKE SYSTEM ############ 
// TODO: Verify publication was send from same user's location. - OLD VERSION
// TODO: https://trello.com/c/lxxAEyYr/33-up-down-system-just-thinking-about-it 

// TODO: Remove find 222 line and use moongosee to find if user liked publication
PublicationSchema.statics.setVote =
  async function (publicationId, authorId, up = true) {
    const targetPublication = await this.findOne({ publicationId }).exec()

    // Change find method for an FindOne, this is useless
    // publication.votes.findOne
    const likeFormated = targetPublication.toObject()
    const userAuthorVote = likeFormated.votes
      .find(vote => `${vote.authorId}` == authorId)

    if (userAuthorVote) {
      targetPublication.votes.id(userAuthorVote._id).remove()
    } else {
      targetPublication.votes.push({ authorId })
    }

    return await targetPublication.save().then(publication => {
      return [publication]
    })
  }

module.exports = mongoose.model('Publication', PublicationSchema)