"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _convertCountryCodes = _interopRequireDefault(require("../services/convertCountryCodes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var AutoIncrement = require('mongoose-sequence')(_mongoose.default);

var {
  Schema
} = _mongoose.default;
var ObjectId = _mongoose.default.Schema.Types.ObjectId;
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
  location,
  likes: [LikeSchema],
  comments: [CommentSchema],
  shares: [ShareSchema],
  commentsAuthors: [randomAuthorSchema]
});
SecretSchema.plugin(AutoIncrement, {
  inc_field: 'secretId'
});
LikeSchema.plugin(AutoIncrement, {
  inc_field: 'likeId'
}); // CommentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });
// SecretSchema.set('toJSON', { getters: true, virtuals: true });
// TODO: implement paginate, scroll infinite

SecretSchema.statics.getAllByNear = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (longitude, latitude) {
    console.log(longitude, latitude);
    var secrets = yield this.find({
      "location.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000,
          $minDistance: 0
        }
      }
    }).select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author') // .skip(2)
    .limit(20).sort({
      publishAt: -1
    }).lean().exec();
    return secrets;
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

console.log();

SecretSchema.statics.getAllByNear = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (longitude, latitude) {
    console.log(longitude, latitude);
    var secrets = yield this.find({
      "location.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000,
          $minDistance: 0
        }
      }
    }).select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author') // .skip(2)
    .limit(20).sort({
      publishAt: -1
    }).lean().exec();
    return secrets;
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

SecretSchema.statics.getAllByCity = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (countryCode, city) {
    // Adapting searching to searched
    countryCode = countryCode.toUpperCase();
    countryCode = _convertCountryCodes.default.convertTwoDigitToThree(countryCode);
    console.log(countryCode, city);
    var secrets = yield this.find({
      "location.countryCode": countryCode,
      "location.city": city
    }).select('content backgroundColor publishAt fontFamily comments shares likes secretId likes.registerAt likes.author') // .skip(2)
    .limit(20).sort({
      publishAt: -1
    }).lean().exec();
    return secrets;
  });

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); // ##### LIKE SYSTEM ############
// TODO: Verify secret was send from same user's location.


SecretSchema.statics.setLiked = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(function* (secretId, author) {
    console.log(secretId, "Holaaa");
    var like = yield this.findOne({
      secretId
    }).exec(); // Change find method for an FindOne, this is useless
    // secret.likes.findOne

    var likeFormated = like.toObject();
    var userLike = likeFormated.likes.find(like => "".concat(like.author) == author); // console.log(userLike,"userlike", likeFormarted, (like.likes[0].author == author), author)

    var rest = false;

    if (userLike) {
      like.likes.id(userLike._id).remove();
      rest = true;
    } else {
      like.likes.push({
        author
      });
    }

    return yield like.save().then(like => {
      // TODO: check this, return only like, rest is useless now
      return [like, rest];
    });
  });

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); // SecretSchema.index({ "location.location.coordinates": "2dsphere" });
// db.secrets.createIndex({"location.location": "2dsphere"})


module.exports = _mongoose.default.model('Secret', SecretSchema);