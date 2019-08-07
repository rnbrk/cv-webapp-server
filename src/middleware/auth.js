const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { authError } = require('../errorMessages/error');

const auth = async (req, res, next) => {
  try {
    // verify token

    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // check if user has token
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    // Supply user to other middlewares
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: authError.NOT_AUTHORIZED });
  }
};

module.exports = auth;
