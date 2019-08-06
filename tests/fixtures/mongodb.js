const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');
const CV = require('../../src/models/cv');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Henk',
  email: 'henk@supertest.com',
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
  name: 'Ellen',
  email: 'ellen@example.com',
  password: 'theMatrix1999@#',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};
const userOneCvOne = {
  user: userOne._id,
  profile: {
    title: `Mijn CV (${userTwo.name})`,
    paragraph: `Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Et ligula ullamcorper malesuada proin libero.`
  },
  skills: {
    title: 'Vaardigheden',
    paragraph: '',
    list: [
      { name: 'JavaScript', rating: 5 },
      { name: 'React', rating: 5 },
      { name: 'SCSS', rating: 4 },
      { name: 'Redux', rating: 5 },
      { name: 'Node', rating: 2 },
      { name: 'Python', rating: 2 },
      { name: 'Git', rating: 2 },
      { name: 'Photoshop', rating: 5 }
    ]
  },
  jobs: {
    title: 'Werkervaring',
    paragraph: '',
    list: [
      {
        jobTitle: 'Excepteur sint occaecat cupidatat ',
        startDate: 0,
        endDate: 0,
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
        name: 'Lorem ipsum dolor sit amet',
        startDate: 0,
        endDate: 0,
        institute: 'Universiteit van Amsterdam',
        diploma: 'BA'
      },
      {
        name: 'Lorem ipsum dolor sit amet',
        startDate: 0,
        endDate: 0,
        institute: 'Universiteit van Amsterdam',
        diploma: 'MA'
      }
    ]
  },
  courses: {
    title: 'Cursussen',
    paragraph: '',
    list: [
      {
        name: 'Ut enim ad minim veniam',
        institute: 'Elementum tempus'
      },
      {
        name: 'Ut enim ad minim veniam',
        institute: 'Elementum tempus'
      }
    ]
  }
};

const userTwoCvOne = {
  user: userTwo._id,
  profile: {
    title: `Mijn CV (${userOne.name})`,
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
  await new User(userOne);
  await new User(userTwo);

  // Create CV fixtures
  await new CV(userOneCvOne);
  await new CV(userTwoCvOne);
  await new CV(userTwoCvTwo);
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
