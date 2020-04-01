import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const locations = new mongoose.Schema({
  ip: {
    type: String,
  },
  countryCode: {
    type: String,
    default: '',
    required: true,
  },
  regionName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
      index: {
        type: '2dsphere',
        sparse: false
      },
    },
  },
  registerAt: {
    type: Date,
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
  locations: [locations],
  registerBy: {
    type: String,
    enum: ['facebook', 'google', 'local'],
  },
  authProvider: {
    type: String,
    enum: ['facebook', 'google', 'local'],
  },
  authProviders,
});

UserSchema.plugin(AutoIncrement, {inc_field: 'userId'});

UserSchema.statics.findUserOrRegister =
async function (
  targetUserId, userData, provider = 'facebook'
) {

  const searchBy = `authProviders.${provider}.id`;

  let user = await this.findOne({
    [searchBy] : targetUserId
  }).exec();

  if (user) {
    // console.log('Finded here and USER', targetUserId, user);
    return user;
  }
  // REGISTER USER BECAUSE DOESNT EXISTS YET
  const registerAt = new Date();

  // Get user geolocation data ########################
  // TODO: Remove file and provider api
  // const userLocation = await getUserLocation(userData.ip);
  const  {
    id,
    name,
    email,
  } = userData;

  let authProviders = {};

  authProviders[provider] = {
    id,
    name,
    email,
    facebookToken: userData.facebookToken || '',
  };

  let newUser = User({
    // Change facebook to provider
    username: provider + '-' + targetUserId,
    // ip,
    authProviders,
    registerBy: provider,
    registerAt,
  });

  return await newUser.save().then((userCreated) => {
    console.log('saved here', userCreated);
    return userCreated;
  });
}

UserSchema.statics.updateUserLocation =
async function(locationData, userId) {
  const _id = userId;
  const user = await this.findOne({ _id }).exec();

  const { coordinates } = locationData.location;

  console.log(locationData);

  let isSameLocation = false;
  if (user.locations && user.locations.length) {
    const userFormated = user.toObject();
    const lastLocation = userFormated.locations.length - 1;
    console.log(userFormated.locations[0], lastLocation);

    const isNewLocation = userFormated.locations[lastLocation];
    isSameLocation = (
      isNewLocation[1] === coordinates[1]
      && isNewLocation[0] === coordinates[0]
    );
  }

  if (!isSameLocation) {
    user.locations.push(locationData);
    return await user.save().then(location => location);
  }

  return false;
}

// UserSchema.index({ "locations.location" : '2dsphere' });
const User = mongoose.model('User', UserSchema);

export default User;