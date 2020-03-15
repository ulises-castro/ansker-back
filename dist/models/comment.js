'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _secret = require('./secret');

var _secret2 = _interopRequireDefault(_secret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose2.default);
var Schema = _mongoose2.default.Schema;


var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    require: true
  },
  secretId: {
    type: ObjectId,
    ref: 'Secret',
    index: true
  },
  content: {
    type: String,
    require: true,
    minLength: 1,
    trim: true
  },
  publishAt: {
    type: Date,
    default: Date.now
  }
});

CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

CommentSchema.statics.publish = async function (secretId, commentData) {
  var author = commentData.author,
      backgroundColor = commentData.backgroundColor;


  var secret = await _secret2.default.findOne({ 'secretId': Number(secretId) }).exec();

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
  var newComment = new this(commentData);

  newComment = await newComment.save().then(function (newComment) {
    return newComment;
  });

  // Create comment in secrets models and save
  secret.comments.push({
    'commentId': newComment._id
  });

  await secret.save().then(function (comment) {
    return comment;
  });

  return secret;
};

module.exports = _mongoose2.default.model('Comments', CommentSchema);