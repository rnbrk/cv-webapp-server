const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { User } = require('../../src/models/user');
const { CV } = require('../../src/models/cv');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  firstName: 'Henk',
  lastName: 'Supertest',
  email: 'henk@supertest.com',
  residence: 'Super City',
  password: '343what!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  email: 'ellen@example.com',
  password: 'theMatrix1999@#',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    },
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};
const userOneCvOne = {
  _id: mongoose.Types.ObjectId().toHexString(),
  user: userOne._id.toHexString(),
  title: userOne.email,
  profile: {
    title: `Mijn CV`,
    paragraph: `Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Et ligula ullamcorper malesuada proin libero.`
  },
  skills: {
    title: 'Vaardigheden',
    paragraph: '',
    list: [
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'JavaScript',
        rating: 5
      },
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'React',
        rating: 5
      },
      { _id: mongoose.Types.ObjectId().toHexString(), name: 'SCSS', rating: 4 },
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Redux',
        rating: 5
      },
      { _id: mongoose.Types.ObjectId().toHexString(), name: 'Node', rating: 2 },
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Python',
        rating: 2
      },
      { _id: mongoose.Types.ObjectId().toHexString(), name: 'Git', rating: 2 },
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Photoshop',
        rating: 5
      }
    ]
  },
  jobs: {
    title: 'Werkervaring',
    paragraph: '',
    list: [
      {
        name: 'Excepteur sint occaecat cupidatat ',
        startDate: '1970-01-01T00:00:00.000Z',
        endDate: '1970-01-01T00:00:00.000Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        responsibilities: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        ]
      }
    ]
  },
  studies: {
    title: 'Opleiding',
    paragraph: '',
    list: [
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Lorem ipsum dolor sit amet',
        startDate: '1970-01-01T00:00:00.000Z',
        endDate: '1970-01-01T00:00:00.000Z',
        instituteName: 'Universiteit van Amsterdam',
        title: 'BA'
      },
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Lorem ipsum dolor sit amet',
        instituteName: 'Universiteit van Amsterdam',
        title: 'MA'
      }
    ]
  },
  courses: {
    title: 'Cursussen',
    paragraph: '',
    list: [
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Ut enim ad minim veniam',
        instituteName: 'Elementum tempus'
      },
      {
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'Ut enim ad minim veniam',
        instituteName: 'Elementum tempus'
      }
    ]
  }
};

const userTwoCvOne = {
  _id: mongoose.Types.ObjectId().toHexString(),
  user: userTwo._id.toHexString(),
  title: userTwo.email,
  profile: {
    title: `Mijn CV`,
    paragraph: `Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Et ligula ullamcorper malesuada proin libero.`
  },
  skills: {
    title: 'Vaardigheden',
    paragraph: '',
    list: []
  },
  jobs: {
    title: 'Werkervaring',
    paragraph: '',
    list: []
  },
  studies: {
    title: 'Opleiding',
    paragraph: '',
    list: []
  },
  courses: {
    title: 'Cursussen',
    paragraph: '',
    list: []
  }
};

const userTwoCvTwo = { user: userTwo._id };

const allCvsOfUserOne = [userOneCvOne];
const allCvsOfUserTwo = [userTwoCvOne, userTwoCvTwo];

const setupDatabase = async () => {
  // Remove all users and tasks
  await User.deleteMany();
  await CV.deleteMany();

  // Create User fixtures
  await new User(userOne).save();
  await new User(userTwo).save();

  // Create CV fixtures
  await new CV(userOneCvOne).save();
  await new CV(userTwoCvOne).save();
  await new CV(userTwoCvTwo).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  userOneCvOne,
  userTwoCvOne,
  userTwoCvTwo,
  allCvsOfUserOne,
  allCvsOfUserTwo,
  setupDatabase
};
