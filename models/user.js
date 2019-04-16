import mongoose from 'mongoose';


const location = {
  type: {
    countryCode: String,
    regionName: String,
    regionCode: String,
    latitude: String,
    longitude: String,
  },
}

const ipsUser = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  location,
  registerAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    default: '',
  },
  // ip: {
  //   type: String,
  //   required: true,
  // },
  ipLogs: [ipsUser],
  registerBy: {
    type: String,
    default: 'facebook'
  },
  authProvider: {
    type: String,
    default: 'facebook'
  },
  authProviders: {
    type: {
      facebook: {
        type: {
          id: String,
          name: String,
          email: String,
          token: String,
        }
      },
      google: {
        type: {
          id: String,
          name: String,
          email: String,
          token: String,
        }
      },
      twitter: {
        type: {
          id: String,
          name: String,
          email: String,
          token: String,
        }
      },
      email: {
        type: String,
      }
    }
  },
});

userSchema.statics.findByLogin = async function (targetUserId, provider = 'facebook') {
  // Search by Provider
  // let user = await this.findOne({
  //   authProviders[provider].id: targetUserId
  // });

  // return user;
}

const User = mongoose.model('User', userSchema);

export default User;
