"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _secret = _interopRequireDefault(require("./secret"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose.default);

var {
  Schema
} = _mongoose.default;
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
CommentSchema.plugin(AutoIncrement, {
  inc_field: 'commentId'
});

CommentSchema.statics.publish = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (secretId, commentData) {
    var {
      author,
      backgroundColor
    } = commentData;
    var secret = yield _secret.default.findOne({
      'secretId': Number(secretId)
    }).exec(); // TODO: Implement avatars functionalities
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
    newComment = yield newComment.save().then(newComment => newComment); // Create comment in secrets models and save

    secret.comments.push({
      'commentId': newComment._id
    });
    yield secret.save().then(comment => comment);
    return secret;
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = _mongoose.default.model('Comments', CommentSchema);