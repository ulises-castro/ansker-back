import mongoose from 'mongoose';


const location = {
  type: {
    countryCode: {
      type: String,
      default: '',
    },
    regionName: {
      type: String,
      default: '',
    },
    regionCode:  {
      type: String,
      default: '',
    },
    latitude:  {
      type: String,
      default: '',
    },
    longitude:  {
      type: String,
      default: '',
    },
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

const authProviders = {
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
  };

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    default: '',
  },
  // Saved all ips
  ipLogs: [ipsUser],
  registerBy: {
    type: String,
    default: 'facebook'
  },
  authProvider: {
    type: String,
    default: 'facebook'
  },
  authProviders,
});

userSchema.statics.findByLogin = async function (targetUserId, provider = 'facebook') {
  // Search by Provider
  // let user = await this.findOne({
  //   authProviders[provider].id: targetUserId
  // });

  // return user;
}

userSchema.statics.findUserOrRegister = async function (targetUserId, userGeolocationData, provider = 'facebook') {

  const registerAt = new Date();
  const {
    ip,
    country_code,
    region_name,
    region_code,
    latitude,
    longitude,
    id,
    name,
    facebookToken
  } = userGeolocationData;

  let newUser = User({
    username: targetUserId,
    // ip,
    ipLogs: {
      ip: ipUser,
      location: {
        countryCode: country_code,
        regionName: region_name,
        regionCode: region_code,
        latitude,
        longitude,
      }
    },
    // authProvider TODO: Facebook is only way to get access
    authProviders: {
      facebook: {
        id,
        name,
        email: '',
        token: facebookToken,
      }
    },
    registerAt,
  });

  return await newUser.save();
}

const User = mongoose.model('User', userSchema);


export default User;
