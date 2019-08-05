const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
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
      const isPhonenumber = val.length === 10 && validator.isNumeric(val);
      if (!val === null || !isPhonenumber) {
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
  photo: { type: Buffer }
});

// TODO: populate with related CV instances

const User = mongoose.model('User', userSchema);

module.exports = User;
