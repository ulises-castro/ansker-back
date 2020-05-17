import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const ObjectId = Schema.Types.ObjectId;

import Publication from './publication';

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
  }
});

CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

CommentSchema.statics.publish =
async function(publicationId, commentData) {

  const { author, backgroundColor } = commentData;

  const publication = await Publication
    .findOne({ 'publicationId': Number(publicationId) }).exec();

  // TODO: Implement avatars functionalities
  // const userHasCommented = await publication
  // .findOne({
  //   '_id' : publication._id,
  //   'commentsAuthors.authorId': author
  // }).exec();

  // // Register authors and asign random avatar as their identify
  // if (!userHasCommented) {
  //   // Modify this to make dinamic to assign inrepeateable avatar
  //   const availableAvatars = 30;
  //   const avatar =  Math.floor(Math.random() * (availableAvatars)) + 1;

  //   publication.commentsAuthors.push({
  //     author,
  //     avatar,
  //     backgroundColor,
  //   });

  //   await publication.save().then(comment => comment);
  // }

  // Save comment data in comments model
  commentData.publicationId = publication._id;
  let newComment = new this(commentData);

  newComment = await newComment.save()
  .then(newComment => newComment);

  // Create comment in publications models and save
  publication.comments.push({
    'commentId': newComment._id
  });

  await publication.save().then(comment => comment);

  return publication;
}

module.exports = mongoose.model('Comments', CommentSchema);
