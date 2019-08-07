const bcrypt = require('bcryptjs');
const request = require('supertest');
const validator = require('validator');

const { User } = require('../../src/models/user');
const { CV } = require('../../src/models/cv');
const app = require('../../src/app');
const { cvRouterError, authError } = require('../../src/errorMessages/error');

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

beforeEach(setupDatabase);

describe('Display cv (GET /cvs/:id)', () => {
  it('Should respond with correct cv data (profile)', async () => {
    const response = await request(app)
      .get(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(200);

    expect(response.body.profile).toMatchObject(userOneCvOne.profile);
  });

  it('Should respond with correct cv data (skills)', async () => {
    const response = await request(app)
      .get(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(200);

    expect(response.body.skills).toMatchObject(userOneCvOne.skills);
  });

  it('Should respond with correct cv data (jobs)', async () => {
    const response = await request(app)
      .get(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(200);

    expect(response.body.jobs).toMatchObject(userOneCvOne.jobs);
  });

  it('Should respond with correct cv data (studies)', async () => {
    const response = await request(app)
      .get(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(200);

    expect(response.body.studies).toMatchObject(userOneCvOne.studies);
  });

  it('Should respond with correct cv data (courses)', async () => {
    const response = await request(app)
      .get(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(200);

    expect(response.body.courses).toMatchObject(userOneCvOne.courses);
  });

  it('Should respond with correct cv data (the rest)', async () => {
    const response = await request(app)
      .get(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(200);
    expect(response.body).toMatchObject(userOneCvOne);
  });

  it('Should respond with a 404 error if cv does not exist', async () => {
    const response = await request(app)
      .get(`/cvs/doesnotexist123`)
      .send()
      .expect(404);

    expect(response.body).toMatchObject({ error: cvRouterError.NOT_FOUND });
  });
});

describe('Create new cv (POST /cvs)', () => {
  it('Should correctly create a new cv', async () => {
    const response = await request(app)
      .post('/cvs')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const expectedResponse = {
      profile: { title: '', paragraph: '' },
      skills: { title: 'Vaardigheden', list: [] },
      jobs: { title: 'Werkervaring', list: [] },
      studies: { title: 'Opleiding', list: [] },
      courses: { title: 'Cursussen', list: [] }
    };

    console.log(response.body);

    // status 200
    // response should be correct
    // cv should be in db
    // cv should have correct fields
    // cv should be with correct user
  });

  it('Should not create a new cv when unauthorized', () => {});
});
