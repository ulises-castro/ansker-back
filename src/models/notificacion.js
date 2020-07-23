import mongoose, {Schema} from 'mongoose';
const AutoIncrement = require ('mongoose-sequence');

const ObjectId = mongoose.Schema.Types.ObjectId;

/*
Type of notifications

0 - Someone has publicate something on your selected city.
1 - Someone comment your publication
2 - Author had comment its publication

//TODO: V1 - Q&A version
0 - There a hot publication on your selected city.

4 - Someone/Author username has ask your question

TODO: 
  1 - Refactorized this into classes to handler in a easy way
*/

const notificationShema = new Schema ({
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

module.exports = mongoose.model ('Notification', notificationShema);
