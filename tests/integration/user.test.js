const request = require('supertest');
const User = require('../../src/models/user');
const {
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
} = require('../fixtures/mongodb');
const app = require('../../src/app');

beforeEach(() => {
  setupDatabase();
});
