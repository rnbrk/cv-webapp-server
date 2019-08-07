const express = require('express');

const { User } = require('../models/user');
const { CV } = require('../models/cv');

const auth = require('../middleware/auth');

const { userRouterError } = require('../errorMessages/error');

const router = express.Router();

/**
 * Create new user
 */
router.post('/users', async (req, res) => {
  try {
    const userAlreadyExists = await User.alreadyExists(req.body.email);
    if (userAlreadyExists) {
      return res.status(400).send({
        error: userRouterError.DUPLICATE_USER
      });
    }

    const user = await new User(req.body);
    const token = await user.createAuthToken();
    res.status(201).send({ token, user });
  } catch (e) {
    res.status(400).send({
      error: userRouterError.INVALID_USER_DATA
    });
  }
});

/**
 * Log in user
 */
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findAndCheckCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.createAuthToken();
    res.send({ token, user });
  } catch (e) {
    res.status(400).send({ error: userRouterError.INVALID_CREDENTIALS });
  }
});

/**
 * Log out user
 */
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * Log out everywhere
 */
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * Display user
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('cvs', 'title')
      .exec();

    if (!user) {
      throw new Error();
    }
    res.send(user);
  } catch (e) {
    res.status(404).send({
      error: userRouterError.NOT_FOUND
    });
  }
});

/**
 * Delete user
 */
router.delete('/users', auth, async (req, res) => {
  try {
    await CV.deleteMany({ user: req.user._id });
    await req.user.remove();

    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: userRouterError.INTERNAL_SERVER_ERROR
    });
  }
});

/**
 * Update user
 */
router.patch('/users', auth, async (req, res) => {
  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res.status(400).send({
      error: userRouterError.INVALID_UPDATES
    });
  }

  const allowedUpdates = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'residence',
    'phoneNumber',
    'email',
    'password'
  ];

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: userRouterError.INVALID_UPDATES });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: userRouterError.INVALID_UPDATES });
  }
});

module.exports = router;
