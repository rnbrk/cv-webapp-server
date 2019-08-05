const mongoose = require('mongoose');

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
  startDate: { type: Date, default: new Date() },
  endDate: { type: Date, default: new Date() },
  instituteName: { type: String, default: '' },
  type: { type: String, default: '' },
  title: { type: String }
});

const courseSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  instituteName: { type: String, default: '' },
  type: { type: String, default: '' }
});

const cvSchema = new mongoose.Schema({
  owner: {
    type: String
    // required: true
    // Validate that the owner should exist?
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
});

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;
