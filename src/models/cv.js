const mongoose = require('mongoose');
const moment = require('moment');

const { User } = require('./user');

const defaultTitle = {
  PROFILE: '',
  SKILLS: 'Vaardigheden',
  JOBS: 'Werkervaring',
  STUDIES: 'Opleiding',
  COURSES: 'Cursussen'
};

const skillSchema = new mongoose.Schema({
  name: { type: String },
  rating: {
    type: Number,
    validate(val) {
      if (val < 1 || val > 5) {
        throw new Error(
          'Skill rating cannot be less than 1 or greater than 5.'
        );
      }
    }
  }
});

const jobSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  startDate: { type: Date, default: new Date() },
  endDate: { type: Date, default: new Date() },
  description: { type: String },
  responsibilities: [String]
});

const studySchema = new mongoose.Schema({
  name: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  instituteName: { type: String, default: '' },
  title: { type: String }
});

const courseSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  instituteName: { type: String, default: '' }
});

const cvSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: `CV ${moment().format('DD-MM-YYYY H:mm')}`
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true
    },
    profile: {
      title: {
        type: String,
        default: defaultTitle.PROFILE
      },
      paragraph: {
        type: String,
        default: ''
      }
    },
    skills: {
      title: {
        type: String,
        default: defaultTitle.SKILLS
      },
      paragraph: {
        type: String
      },
      list: [skillSchema]
    },
    jobs: {
      title: {
        type: String,
        default: defaultTitle.JOBS
      },
      paragraph: {
        type: String
      },
      list: [jobSchema]
    },
    studies: {
      title: {
        type: String,
        default: defaultTitle.STUDIES
      },
      paragraph: {
        type: String
      },
      list: [studySchema]
    },
    courses: {
      title: {
        type: String,
        default: defaultTitle.COURSES
      },
      paragraph: {
        type: String
      },
      list: [courseSchema]
    }
  },
  { strict: 'throw' }
);

const CV = mongoose.model('CV', cvSchema);

module.exports = { CV };
