const mongoose = require('mongoose');
const moment = require('moment');

const { User } = require('./user');

const cvDefaults = {
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
  employerName: String,
  startDate: Date,
  endDate: Date,
  description: String,
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
        default: cvDefaults.PROFILE
      },
      paragraph: {
        type: String,
        default: 'Profile description'
      }
    },
    skills: {
      title: {
        type: String,
        default: cvDefaults.SKILLS
      },
      paragraph: {
        type: String
      },
      list: [skillSchema]
    },

    /**
     * TODO:
     *
     * Jobs should be sorted from new to old (up to down)
     * Job without date is sorted later than with date
     * Jobs without date are sorted alphabetically on job title
     * Job title is required
     * endDate is only allowed if startDate is not empty
     * endDate must be > than startDate
     * dateRange of one job may not overlap dateRange of another job
     */

    jobs: {
      title: {
        type: String,
        default: cvDefaults.JOBS
      },
      paragraph: {
        type: String
      },
      list: [jobSchema]
    },
    studies: {
      title: {
        type: String,
        default: cvDefaults.STUDIES
      },
      paragraph: {
        type: String
      },
      list: [studySchema]
    },
    courses: {
      title: {
        type: String,
        default: cvDefaults.COURSES
      },
      paragraph: {
        type: String
      },
      list: [courseSchema]
    }
  },
  {}
);

const CV = mongoose.model('CV', cvSchema);

module.exports = { CV, cvDefaults };
