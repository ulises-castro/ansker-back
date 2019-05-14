import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const ObjectId = Schema.Types.ObjectId;

import Secret from './secret';

const CommentSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    require: true,
  },
  secretId: {
    type: ObjectId,
    ref: 'Secret',
    index: true,
  },
  content: {
    type: String,
    require: true,
    minLength: 1,
    trim: true,
  },
  publishAt: {
    type: Date,
    default: Date.now,
  }
});

CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

CommentSchema.statics.publish =
async function(secretId, commentData) {

  const { author, backgroundColor } = commentData;

  const secret = await Secret
    .findOne({ 'secretId': Number(secretId) }).exec();

  // TODO: Implement avatars functionalities
  // const userHasCommented = await Secret
  // .findOne({
  //   '_id' : secret._id,
  //   'commentsAuthors.authorId': author
  // }).exec();

  // // Register authors and asign random avatar as their identify
  // if (!userHasCommented) {
  //   // Modify this to make dinamic to assign inrepeateable avatar
  //   const availableAvatars = 30;
  //   const avatar =  Math.floor(Math.random() * (availableAvatars)) + 1;

  //   secret.commentsAuthors.push({
  //     author,
  //     avatar,
  //     backgroundColor,
  //   });

  //   await secret.save().then(comment => comment);
  // }

  // Save comment data in comments model
  commentData.secretId = secret._id;
  let newComment = new this(commentData);

  newComment = await newComment.save()
  .then(newComment => newComment);

  // Create comment in secrets models and save
  secret.comments.push({
    'commentId': newComment._id
  });

  await secret.save().then(comment => comment);

  return secret;
}

module.exports = mongoose.model('Comments', CommentSchema);
