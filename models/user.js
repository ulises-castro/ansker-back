import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    default: '',
  },
  position: {
    type: {
      lat: {
        type: String,
      },
      long: {
        type: String,
      },
      lastUpdated: {
        type: Date,
      }
    }
  },
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
        type: string,
      }
    }
  },
});

userSchema.statics.findByLogin = async function (facebookId) {
  let user = await this.findOne({
    facebook.id: facebookId
  });

  return user;
}

const User = mongoose.model('User', userSchema);
