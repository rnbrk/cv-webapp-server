const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const { User } = require('../models/user');
const { CV } = require('../models/cv');

const auth = require('../middleware/auth');
const verifyRefreshToken = require('../middleware/verifyRefreshToken');
const { arrayContainsItemOfOtherArray } = require('../../src/utils/utils');
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
    const refreshToken = await user.createAuthToken(true);
    res.status(201).send({ refreshToken, token, user });
  } catch (e) {
    res.status(400).send({
      error: userRouterError.INVALID_USER_DATA
    });
  }
});

/**
 * Refresh token
 */
router.post('/users/token', verifyRefreshToken, async (req, res) => {
  try {
    const token = await req.user.createAuthToken();
    res.send({ token });
  } catch (e) {
    res.status(500).send();
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
    const refreshToken = await user.createAuthToken(true);

    res.send({ refreshToken, token, user });
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
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error();
    }
    res.send({ user });
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

  const ALLOWED_UPDATES = [
    'fullName',
    'profession',
    'dateOfBirth',
    'residence',
    'phoneNumber',
    'email',
    'password',
    'website'
  ];

  const isValidOperation = arrayContainsItemOfOtherArray(
    updates,
    ALLOWED_UPDATES
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: userRouterError.INVALID_UPDATES });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send({ user: req.user });
  } catch (e) {
    res.status(400).send({ error: userRouterError.INVALID_UPDATES });
  }
});

/**
 * Add/update user photo
 */

const photo = multer({
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    const hasImageFileExtension = /([a-zA-Z0-9\s_\\.\-\(\):]+)\.(jpeg|jpg|png)$/.test(
      file.originalname
    );
    const hasImageMimeType = /(image\/)(jpeg|jpg|png)$/.test(file.mimetype);
    if (!hasImageFileExtension || !hasImageMimeType) {
      return cb(
        new Error('File should be an image file (jpeg or png).'),
        undefined
      );
    }
    cb(undefined, true);
  }
});

router.post(
  '/users/photo',
  auth,
  photo.single('photo'),
  async (req, res) => {
    const imageBuffer = await sharp(req.file.buffer)
      .resize(300)
      .toBuffer();

    req.user.photo = imageBuffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

/**
 * Delete user photo
 */
router.delete('/users/photo', auth, async (req, res) => {
  req.user.photo = undefined;
  await req.user.save();
  res.send();
});

/**
 * Show user photo
 */
router.get('/users/:id/photo', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.photo) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.photo);
  } catch (e) {
    res.status(404).send({ error: userRouterError.NOT_FOUND });
  }
});

module.exports = router;
