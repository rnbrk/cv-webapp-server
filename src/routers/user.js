const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const user = await new User(req.body);
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
