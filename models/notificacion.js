import mongoose, { Schema } from 'mongoose';
const AutoIncrement = require('mongoose-sequence');

const ObjectId = mongoose.Schema.Types.ObjectId;

const notification = new Schema({
  type: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: '',
  },
  readAt: {
    type: Date,
    required: false,
  }
});