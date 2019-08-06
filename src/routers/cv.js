const express = require('express');
const CV = require('../models/cv');

const router = express.Router();

router.get('/cvs/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    res.send(cv);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/cvs', async (req, res) => {
  try {
    const cv = new CV({ user: '5d495976f97ef72636759389' });
    await cv.save();
    res.send(cv);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/cvs/:id', async (req, res) => {
  try {
    const result = await CV.deleteOne({ _id: req.params.id });

    if (result.deletedCount !== 1) {
      res.status(400).send({ error: `Could not delete cv.` });
    }

    res.send();
  } catch (e) {
    res.status(500).send({
      error: 'Internal server error.'
    });
  }
});

router.patch('/cvs/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(400).send({ error: 'Could not update cv.' });
    }
    console.log(req.body);
    updates.forEach(update => {
      console.log(req.body[update]);
      cv[update] = req.body[update];
    });
    await cv.save();
    res.send(cv);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
