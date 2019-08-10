const bcrypt = require('bcryptjs');
const request = require('supertest');
const validator = require('validator');

const { User } = require('../../src/models/user');
const { CV } = require('../../src/models/cv');
const app = require('../../src/app');
const { userRouterError, authError } = require('../../src/errorMessages/error');
const { userOne, userTwo, setupDatabase } = require('../fixtures/mongodb');

beforeEach(setupDatabase);

describe('Create new user (POST /users)', () => {
  let payload;

  beforeEach(() => {
    payload = { email: 'ron@web.dev', password: 'Flarlar12!' };
  });

  it('Should create new user when given correct credentials', async () => {
    const response = await request(app)
      .post('/users')
      .send(payload)
      .expect(201);

    // It should supply a JWT token
    expect(validator.isJWT(response.body.token)).toBe(true);

    // Should supply JWT refreshToken
    expect(validator.isJWT(response.body.refreshToken)).toBe(true);

    const user = await User.findOne({ email: payload.email });
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
      user: { email: payload.email },
      token: user.tokens[0].token
    });
  });

  it('Should not create new user when given incorrect email address', async () => {
    payload.email = 'wrong@email';

    const response = await request(app)
      .post('/users')
      .send(payload)
      .expect(400);

    const user = await User.findOne({ email: payload.email });
    expect(user).toBeNull();

    // Should get correct error message
    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_USER_DATA
    });
  });

  it('Should not create new user when given password with < 8 characters', async () => {
    payload.password = 'a';

    const response = await request(app)
      .post('/users')
      .send(payload)
      .expect(400);

    const user = await User.findOne({ email: payload.email });
    expect(user).toBeNull();

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_USER_DATA
    });
  });

  it('Should not create new user when email address already exists', async () => {
    payload.email = userOne.email;

    const response = await request(app)
      .post('/users')
      .send(payload)
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.DUPLICATE_USER
    });
  });

  it('Should not create new user when not supplied a payload', async () => {
    const response = await request(app)
      .post('/users')
      .send()
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_USER_DATA
    });
  });
});

describe('Login user (POST /users/login)', () => {
  it('Should log in when given correct credentials', async () => {
    const payload = { email: userOne.email, password: userOne.password };
    const response = await request(app)
      .post('/users/login')
      .send(payload)
      .expect(200);

    expect(response.body.password).toBeUndefined();

    const user = await User.findOne({ email: payload.email });
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
      user: { email: payload.email },
      token: user.tokens[1].token,
      refreshToken: user.refreshTokens[1].token
    });
  });

  it('Should not log in when given email address does not exist', async () => {
    const payload = { email: 'doesnot@exist.com', password: userOne.password };
    const response = await request(app)
      .post('/users/login')
      .send(payload)
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_CREDENTIALS
    });
  });

  it('Should not log in when password is incorrect', async () => {
    const payload = { email: userOne.email, password: 'wrongpassword123' };
    const response = await request(app)
      .post('/users/login')
      .send(payload)
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_CREDENTIALS
    });
  });

  it('Should not log in when given no payload', async () => {
    const response = await request(app)
      .post('/users/login')
      .send()
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_CREDENTIALS
    });
  });
});

describe('Logout user (POST /users/logout)', () => {
  it('Should logout user when authorized', async () => {
    await request(app)
      .post('/users/logout')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    const user = await User.findById(userOne._id);

    // Check if token is deleted
    expect(user.tokens.length).toBe(userOne.tokens.length - 1);
  });

  it('Should not logout user when unauthorized', async () => {
    const response = await request(app)
      .post('/users/logout')
      .send()
      .expect(401);

    expect(response.body).toMatchObject({ error: authError.NOT_AUTHORIZED });
  });
});

describe('Logout all users (POST /users/logoutAll)', () => {
  it('Should logout all users when authorized', async () => {
    await request(app)
      .post('/users/logout')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(200);

    // Using userTwo, because it has TWO tokens
    const user = await User.findById(userTwo._id);

    // Check if all tokens are deleted
    expect(user.tokens.length).toBe(0);
  });

  it('Should not logout all users when unauthorized', async () => {
    const response = await request(app)
      .post('/users/logoutAll')
      .send()
      .expect(401);

    expect(response.body).toMatchObject({ error: authError.NOT_AUTHORIZED });
  });
});

describe('Display user (GET /users)', () => {
  it('Should correctly send back user data', async () => {
    const response = await request(app)
      .get(`/users/${userOne._id}`)
      .send()
      .expect(200);

    // response should contain correct data
    expect(response.body).toMatchObject({
      firstName: userOne.firstName,
      lastName: userOne.lastName,
      email: userOne.email
    });

    // response should not contain sensitive data
    expect(response.body.password).toBeUndefined();
    expect(response.body.tokens).toBeUndefined();

    // Null defaults should not be sent
    expect(response.body.phoneNumber).toBeUndefined();
  });

  it('Should should send correct error message when user does not exist', async () => {
    const response = await request(app)
      .get(`/users/123doesnotexist`)
      .send()
      .expect(404);

    expect(response.body).toMatchObject({ error: userRouterError.NOT_FOUND });
  });
});

describe('Delete user (DELETE /users)', () => {
  it('Should delete user when authorized', async () => {
    await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(200);

    // User should be deleted
    const user = await User.findById(userTwo._id);
    expect(user).toBeNull();

    // All CVs should be deleted
    const cvsFromUser = await CV.find({ user: userTwo._id });
    expect(cvsFromUser.length).toBe(0);
  });

  it('Should send correct error when unauthorized', async () => {
    const response = await request(app)
      .delete('/users')
      .send()
      .expect(401);

    expect(response.body).toMatchObject({ error: authError.NOT_AUTHORIZED });
  });
});

describe('Update user (PATCH /users)', () => {
  it('Should apply updates correctly', async () => {
    const updatesWithoutPassword = {
      firstName: 'Test',
      lastName: 'Subject',
      phoneNumber: '1234567890',
      email: 'test@test.nl'
    };

    const password = 'nUwpaZzwuRt587$';

    const response = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({ ...updatesWithoutPassword, password });

    // Response should contain correct data
    expect(response.body).toMatchObject(updatesWithoutPassword);

    // Response should not contain sensitive data
    expect(response.body.password).toBeUndefined();
    expect(response.body.tokens).toBeUndefined();

    // Check database if updates are correctly applied
    const user = await User.findById(userOne._id);
    expect(user).toMatchObject(updatesWithoutPassword);

    // Check if password is correctly updated
    const passwordHasMatched = await bcrypt.compare(password, user.password);
    expect(passwordHasMatched).toBe(true);
  });

  it('Should not apply updates when unauthenticated', async () => {
    const updates = {
      firstName: 'Test',
      lastName: 'Subject'
    };

    const response = await request(app)
      .patch('/users')
      .send(updates)
      .expect(401);

    expect(response.body).toMatchObject({ error: authError.NOT_AUTHORIZED });
  });

  it('Should not apply unallowed updates', async () => {
    const unallowedUpdates = {
      favoriteColor: 'Red',
      height: 180,
      lovesKittens: true
    };

    const response = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(unallowedUpdates)
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_UPDATES
    });
  });

  it('Should update dateOfBirth', async () => {
    const update = { dateOfBirth: -6106024800000 };

    const response = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(update)
      .expect(200);

    const expectedResponse = {
      ...userOne,
      dateOfBirth: new Date(update.dateOfBirth).toISOString(),
      _id: userOne._id.toString()
    };
    delete expectedResponse.password;
    delete expectedResponse.tokens;
    delete expectedResponse.refreshTokens;

    expect(response.body).toMatchObject(expectedResponse);
  });

  it('Should not apply updated email to one from another user', async () => {
    const update = { email: userTwo.email };

    const response = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send(update)
      .expect(400);

    expect(response.body).toMatchObject({
      error: userRouterError.INVALID_UPDATES
    });
  });
});

describe('Add/update user photo (POST /users/photo)', () => {
  it('Should correctly add new photo', async () => {
    await request(app)
      .post('/users/photo')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('photo', './tests/fixtures/chewbacca.jpg')
      .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.photo instanceof Buffer).toBe(true);
  });

  it('Should not add new photo when not authenticated', async () => {
    const response = await request(app)
      .post('/users/photo')
      .attach('photo', './tests/fixtures/chewbacca.jpg')
      .expect(401);

    expect(response.body).toMatchObject({ error: authError.NOT_AUTHORIZED });
  });

  it('Should not add file other than photo', async () => {
    const response = await request(app)
      .post('/users/photo')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('photo', './tests/fixtures/test.odt')
      .expect(400);

    expect(typeof response.body.error).toBe('string');

    const user = await User.findById(userOne._id);
    expect(user.photo instanceof Buffer).toBe(false);
  });
});

describe('Delete user photo (DELETE /users/photo)', () => {
  beforeEach(async () => {
    await request(app)
      .post('/users/photo')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('photo', './tests/fixtures/chewbacca.jpg');
  });

  it('Should correctly delete photo', async () => {
    await request(app)
      .delete('/users/photo')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('photo', './tests/fixtures/test.odt')
      .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.photo).toBeUndefined();
    expect(user.photo instanceof Buffer).toBe(false);
  });

  it('Should not delete photo if not authorized', async () => {
    const response = await request(app)
      .delete('/users/photo')
      .attach('photo', './tests/fixtures/test.odt')
      .expect(401);

    expect(response.body).toMatchObject({ error: authError.NOT_AUTHORIZED });
  });
});

describe('Display user photo (GET /users/:id/photo)', () => {
  it('Should correctly display photo', async () => {
    await request(app)
      .post('/users/photo')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('photo', './tests/fixtures/chewbacca.jpg');

    const response = await request(app)
      .get(`/users/${userOne._id}/photo`)
      .expect(200);

    expect(response.body instanceof Buffer).toBe(true);
  });

  it('Should give 404 when photo does not exist', async () => {
    const response = await request(app)
      .get(`/users/123doesnotexist/photo`)
      .expect(404);

    expect(response.body).toEqual({ error: userRouterError.NOT_FOUND });
    expect(response.body instanceof Buffer).toBe(false);
  });
});

describe('Refresh token (POST /users/token)', () => {
  it('Should send token when refreshToken and email are supplied', async () => {
    const payload = { email: userOne.email };
    const response = await request(app)
      .post('/users/token')
      .set('Authorization', `Bearer ${userOne.refreshTokens[0].token}`)
      .send(payload)
      .expect(200);

    expect(response.body.password).toBeUndefined();

    const user = await User.findById(userOne._id);

    expect(response.body).toMatchObject({
      token: user.tokens[1].token
    });
  });

  it('Should not send token when not given refreshToken', async () => {
    const payload = { email: userOne.email };
    const response = await request(app)
      .post('/users/token')
      .send(payload)
      .expect(401);

    expect(response.body).toEqual({ error: authError.NOT_AUTHORIZED });

    const user = await User.findById(userOne._id);
    expect(user.tokens.length).toBe(userOne.tokens.length);
  });

  it('Should not send token without email address', async () => {
    const response = await request(app)
      .post('/users/token')
      .set('Authorization', `Bearer ${userOne.refreshTokens[0].token}`)
      .send()
      .expect(401);

    expect(response.body).toEqual({ error: authError.NOT_AUTHORIZED });

    const user = await User.findById(userOne._id);
    expect(user.tokens.length).toBe(userOne.tokens.length);
  });
});
