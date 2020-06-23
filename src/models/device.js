import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const DeviceSchema = {
  ip: {
    type: 'string',
    required: true,
    default: ''
  },
  userId: {
    type: ObjectId,
    required: false,
    index: true
  },
  platform: {
    type: String,
    enum: ['android', 'ios', 'linux', 'windows', 'other'],
    default: 'other'
  },
  browser: {
    type: String,
    enum: ['safari','opera', 'chrome', 'edge', 'other'],
    default: 'other'
  },
  token: {
    type: String,
    required: true
  }
}


const Device = mongoose.model('Device', DeviceSchema)

export default Device