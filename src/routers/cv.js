const express = require('express');
const CV = require('../models/cv');

const router = express.Router();

router.post('/cvs', async (req, res) => {
  try {
    const cv = new CV();
    await cv.save();
    res.send(cv);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/cvs/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    res.send(cv);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
