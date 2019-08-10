const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: null,
      trim: true
    },
    lastName: {
      type: String,
      default: null,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      default: Date.now()
    },
    residence: {
      type: String,
      default: null,
      trim: true
    },
    phoneNumber: {
      type: String,
      default: null,
      validate(val) {
        const isPhoneNumberOrNull =
          val === null || (val.length === 10 && validator.isNumeric(val));
        if (!isPhoneNumberOrNull) {
          throw new Error('A phone number should be 10 numbers');
        }
      }
    },
    email: {
      required: true,
      type: String,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error('This is not a valid email address.');
        }
      }
    },
    password: {
      required: true,
      type: String,
      // TODO: Should be hashed
      validate(val) {
        // TODO: more validation
        const isValidPassword = val.length >= 8;
        if (!isValidPassword) {
          throw new Error('A password requires 8 characters or more.');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    refreshTokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    photo: { type: Buffer }
  },
  { strict: 'throw', toJSON: { virtuals: true } }
);

userSchema.virtual('cvs', {
  ref: 'CV',
  localField: '_id',
  foreignField: 'user'
});

/**
 * Generates and returns JSON web token and puts it in user.tokens array
 */
userSchema.methods.createAuthToken = async function(refreshToken = false) {
  const user = this;

  if (refreshToken) {
    token = await jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '1 minute'
      }
    );
  }

  if (!refreshToken) {
    token = await jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: '10 seconds'
      }
    );
  }

  if (refreshToken) {
    user.refreshTokens.push({ token });
  } else {
    user.tokens.push({ token });
  }

  await user.save();
  return token;
};

/**
 * Removes private data and avatar from the userObject
 * before it gets converted to JSON and sent back to the client in the response
 * @method toJSON
 * @returns {object} - Cleaned up user data
 */
userSchema.methods.toJSON = function() {
  const user = this;

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.refreshTokens;
  delete userObject.photo;
  delete userObject.id;
  delete userObject.__v;

  const keys = Object.keys(userObject);
  keys.forEach(key => {
    if (userObject[key] === null) {
      delete userObject[key];
    }
  });

  return userObject;
};

/**
 * Hashes plain text password before saving
 */
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

/**
 * Finds user by email address, then checks plain text password with hashed stored password
 */
userSchema.statics.findAndCheckCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User cannot be authenticated');
  }
  // Check if password is correct
  const authenticated = await bcrypt.compare(password, user.password);

  if (!authenticated) {
    throw new Error('User cannot be authenticated');
  }

  return user;
};

/**
 * Returns true if a user with the email address already exists, false otherwise
 */
userSchema.statics.alreadyExists = async email => {
  const user = await User.findOne({ email });
  return !!user;
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
