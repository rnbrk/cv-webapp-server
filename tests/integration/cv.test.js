const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const validator = require('validator');

const { User } = require('../../src/models/user');
const { CV, cvDefaults } = require('../../src/models/cv');
const app = require('../../src/app');
const { cvRouterError, authError } = require('../../src/errorMessages/error');
const { convertDatesToISOStrings } = require('../../src/utils/utils');

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
  setupDatabase,
  testUpdates
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
      profile: { title: cvDefaults.PROFILE, paragraph: '' },
      skills: { title: cvDefaults.SKILLS, list: [] },
      jobs: { title: cvDefaults.JOBS, list: [] },
      studies: { title: cvDefaults.STUDIES, list: [] },
      courses: { title: cvDefaults.COURSES, list: [] }
    };

    expect(response.body).toMatchObject(expectedResponse);

    // cv should be in db and have correct fields
    const cv = await CV.findOne({ _id: response.body._id, user: userOne._id });
    expect(cv.toObject()).toMatchObject(expectedResponse);

    // cv should be with correct user
    expect(cv.user).toEqual(userOne._id);
  });

  it('Should not create a new cv when unauthorized', async () => {
    const response = await request(app)
      .post('/cvs')
      .send()
      .expect(401);

    expect(response.body).toEqual({ error: authError.NOT_AUTHORIZED });
  });
});

describe('Delete cv (DELETE /cvs)', () => {
  it('Should correctly delete cv', async () => {
    await request(app)
      .delete(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const cv = await CV.findById(userOneCvOne._id);
    expect(cv).toBeNull();
  });

  it('Should give correct error cv does not exist', async () => {
    const response = await request(app)
      .delete(`/cvs/123doesnotexist`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(404);

    expect(response.body).toEqual({ error: cvRouterError.NOT_FOUND });
  });

  it('Should not delete cv if unauthorized', async () => {
    const response = await request(app)
      .delete(`/cvs/${userOneCvOne._id}`)
      .send()
      .expect(401);

    expect(response.body).toEqual({ error: authError.NOT_AUTHORIZED });

    const cv = await CV.findById(userOneCvOne._id);
    expect(cv).not.toBeNull();
  });

  it('Should not delete cv of another user', async () => {
    const response = await request(app)
      .delete(`/cvs/${userTwoCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(404);

    expect(response.body).toEqual({ error: cvRouterError.NOT_FOUND });

    const cv = await CV.findById(userTwoCvOne._id);
    expect(cv).not.toBeNull();
  });
});

describe('Update cv (PATCH /cvs/:id)', () => {
  it('Should apply updates correctly (profile)', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(200);

    expect(response.body.profile).toMatchObject(testUpdates.profile);

    const cv = await CV.findById(userOneCvOne._id);
    expect(convertDatesToISOStrings(cv.profile)).toMatchObject(
      testUpdates.profile
    );
  });

  it('Should apply updates correctly (skills)', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(200);

    expect(response.body.skills).toMatchObject(testUpdates.skills);

    const cv = await CV.findById(userOneCvOne._id);
    expect(convertDatesToISOStrings(cv.skills)).toMatchObject(
      testUpdates.skills
    );
  });

  it('Should apply updates correctly (jobs)', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(200);

    expect(response.body.jobs).toMatchObject(testUpdates.jobs);

    const cv = await CV.findById(userOneCvOne._id);
    expect(convertDatesToISOStrings(cv.jobs)).toMatchObject(testUpdates.jobs);
  });

  it('Should apply updates correctly (studies)', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(200);

    expect(response.body.studies).toMatchObject(testUpdates.studies);

    const cv = await CV.findById(userOneCvOne._id);
    expect(convertDatesToISOStrings(cv.studies)).toMatchObject(
      testUpdates.studies
    );
  });

  it('Should apply updates correctly (courses)', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(200);

    expect(response.body.courses).toMatchObject(testUpdates.courses);

    const cv = await CV.findById(userOneCvOne._id);
    expect(convertDatesToISOStrings(cv.courses)).toMatchObject(
      testUpdates.courses
    );
  });

  it('Should apply updates correctly (the rest)', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(200);

    expect(response.body).toMatchObject(testUpdates);

    const cv = await CV.findById(userOneCvOne._id);
    expect(convertDatesToISOStrings(cv)).toMatchObject(testUpdates);
  });

  it('Should not apply updates when unauthorized', async () => {
    const response = await request(app)
      .patch(`/cvs/${userOneCvOne._id}`)
      .send(testUpdates)
      .expect(401);

    expect(response.body).toEqual({ error: authError.NOT_AUTHORIZED });

    const cv = await CV.findById(userOneCvOne._id);

    expect(convertDatesToISOStrings(cv)).toMatchObject(userOneCvOne);
    expect(convertDatesToISOStrings(cv)).not.toMatchObject(testUpdates);
  });

  it('Should not apply updates on a cv from a different user', async () => {
    const response = await request(app)
      .patch(`/cvs/${userTwoCvOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(404);

    expect(response.body).toEqual({ error: cvRouterError.NOT_FOUND });

    const cv = await CV.findById(userTwoCvOne._id);
    expect(convertDatesToISOStrings(cv)).toMatchObject(userTwoCvOne);
    expect(convertDatesToISOStrings(cv)).not.toMatchObject(testUpdates);
  });

  // cv does not exist
  it('Should not apply updates on a cv from a different user', async () => {
    const response = await request(app)
      .patch(`/cvs/1234doesnotexist`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(testUpdates)
      .expect(404);

    expect(response.body).toEqual({ error: cvRouterError.NOT_FOUND });
  });
});
