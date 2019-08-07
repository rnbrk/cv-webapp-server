const express = require('express');

const auth = require('../middleware/auth');
const { CV } = require('../models/cv');
const { cvRouterError } = require('../errorMessages/error');

const router = express.Router();

/**
 * Display cv
 */
router.get('/cvs/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    res.send(cv);
  } catch (e) {
    res.status(404).send({
      error: cvRouterError.NOT_FOUND
    });
  }
});

/**
 * Create new cv
 */
router.post('/cvs', auth, async (req, res) => {
  try {
    const cv = new CV({ user: req.user._id });
    await cv.save();
    res.send(cv);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Delete cv
 */
router.delete('/cvs/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!cv) {
      throw new Error();
    }

    cv.remove();
    res.send();
  } catch (e) {
    res.status(404).send({
      error: cvRouterError.NOT_FOUND
    });
  }
});

/**
 * Update cv
 */
router.patch('/cvs/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);

    const query = {
      _id: req.params.id,
      user: req.user._id
    };

    const cv = await CV.findOne(query);
    if (!cv) {
      return res.status(400).send({ error: 'Could not update cv.' });
    }

    updates.forEach(update => {
      cv[update] = req.body[update];
    });
    const newCv = await cv.save();
    res.send(newCv);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;