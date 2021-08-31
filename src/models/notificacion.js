import mongoose, { Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationShema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  readedAt: {
    type: Date,
    default: null,
    required: false,
  },
  type: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Notification', notificationShema);
