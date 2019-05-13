'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoIncrement = require('mongoose-sequence');

var ObjectId = _mongoose2.default.Schema.Types.ObjectId;

var notification = new _mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: ''
  },
  readAt: {
    type: Date,
    required: false
  }
});