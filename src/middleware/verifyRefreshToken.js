const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { authError } = require('../errorMessages/error');

const verifyRefreshToken = async (req, res, next) => {
  try {
    // verify refresh token
    const refreshToken = req.headers.authorization.replace('Bearer ', '');
    const decoded = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // check if user has token
    const user = await User.findOne({
      email: req.body.email,
      _id: decoded._id,
      'refreshTokens.token': refreshToken
    });

    if (!user) {
      throw new Error();
    }

    // Supply user to other middlewares
    req.id = user._id;
    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (e) {
    res.status(401).send({ error: authError.NOT_AUTHORIZED });
  }
};

module.exports = verifyRefreshToken;
