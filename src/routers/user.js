const express = require('express');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Create new user
 */
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.createAuthToken();
    res.status(201).send({ token, user });
  } catch (e) {
    res.status(400).send(e);
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
    res.status(400).send({ error: 'User cannot be authenticated' });
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
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Delete user
 */
router.delete('/users', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send();
  } catch (e) {
    res.status(500).send({
      error: 'Internal server error.'
    });
  }
});

/**
 * Update user
 */
router.patch('/users', auth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'residence',
    'phoneNumber',
    'email',
    'password',
    'photo'
  ];

  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
