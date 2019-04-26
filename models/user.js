import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const location = {
  type: {
    countryCode: {
      type: String,
      default: '',
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    regionName: {
      type: String,
      required: true,
    },
    regionCode:  {
      type: String,
      required: true,
    },
    latitude:  {
      type: String,
      required: true,
    },
    longitude:  {
      type: String,
      required: true,
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
          id: {
            type: String,
            unique: true,
          },
          name: String,
          email: String,
          token: String,
        }
      },
      google: {
        type: {
          id: {
            type: String,
            unique: true,
          },
          name: String,
          email: String,
          token: String,
        }
      },
      twitter: {
        type: {
          id: {
            type: String,
            unique: true,
          },
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

const UserSchema = new mongoose.Schema({
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

// include services to get user geolocation data
import getUserLocation from '../services/getLocation';

UserSchema.plugin(AutoIncrement, {inc_field: 'user_id'});

UserSchema.statics.findUserOrRegister = async function (targetUserId, userData, provider = 'facebook') {

  let user = await this.findOne({
    'authProviders.facebook.id': targetUserId
  }).exec();

  if (user) {
    // console.log('Finded here and USER', targetUserId, user);
    return user;
  }

  // console.log(targetUserId, userData, user, targetUserId, "Mirame en el modelo");

  // REGISTER USER BECAUSE DOESNT EXISTS YET

  const registerAt = new Date();

  // Get user geolocation data ########################
  const userLocation = await getUserLocation(userData.ip);

  const {
    ip,
    city,
    country_code,
    region_name,
    region_code,
    latitude,
    longitude,
  } = userLocation.data;

  const  {
    id,
    name,
    email,
    facebookToken,
  } = userData;

  let newUser = User({
    // Change facebook to provider
    username: 'facebook-' + targetUserId,
    // ip,
    ipLogs: {
      ip,
      location: {
        countryCode: country_code,
        regionName: region_name,
        regionCode: region_code,
        city: city,
        latitude,
        longitude,
      }
    },
    // authProvider TODO: Facebook is only way to get access
    // Added more authProvider (Google | Twitter);
    authProviders: {
      facebook: {
        id,
        name,
        email,
        // TODO Create a function which performences update facebooktoken when user had been signed
        token: facebookToken,
      }
    },
    registerAt,
  });

  const userCreated = await newUser.save().then((userCreated) => {
    // console.log('saved here', userCreated);
    return userCreated;
  });

  return userCreated;
}

const User = mongoose.model('User', UserSchema);

export default User;
