import mongoose from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)
const { Schema } = mongoose

const ObjectId = Schema.Types.ObjectId

import Publication from './publication'

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
})

const CommentSchema = new Schema({
  authorId: {
    type: ObjectId,
    ref: 'User',
    require: true,
  },
  publicationId: {
    type: ObjectId,
    ref: 'publication',
    index: true,
  },
  content: {
    type: String,
    require: true,
    minLength: 2,
    maxlength: 500,
    trim: true,
  },
  publishAt: {
    type: Date,
    default: Date.now,
  },
  likes: [LikeSchema],
})

CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' })

// TODO: fix this, and add random avatars
CommentSchema.statics.publish =
async function(publicationId, commentData) {
  // const { author, backgroundColor } = commentData
  const publication = await Publication
    .findOne({ 'publicationId': Number(publicationId) }).exec()

  // Save comment data in comments model
  commentData.publicationId = publication._id
  let newComment = new this(commentData)

  newComment = await newComment.save()
  .then(newComment => newComment)

  return publication
}

CommentSchema.statics.getAll = async function (publicationId,userId) {
  const publication = await Publication
  .findOne({ 'publicationId': Number(publicationId) }).exec()

  let comments = await this.find({ publicationId: publication._id })
  .select('-_id -likes')
  .lean()

  comments = comments.map(comment => {
    comment.userAuthor = (comment.authorId === userId) ? true : false

    delete comment.authorId

    return comment
  })

  return comments
}

CommentSchema.set('toJSON', { getters: true, virtuals: true })

module.exports = mongoose.model('Comments', CommentSchema)
