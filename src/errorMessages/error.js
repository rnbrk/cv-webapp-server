const userRouterError = {
  DUPLICATE_USER: 'Cannot create user: user already exists.',
  INVALID_USER_DATA: 'Cannot create user: invalid user data.',
  INVALID_CREDENTIALS: 'Cannot authenticate: invalid credentials.',
  INTERNAL_SERVER_ERROR: 'Cannot continue: internal server error.',
  INVALID_UPDATES: 'Cannot apply updates: invalid update data.',
  NOT_FOUND: 'Cannot continue: data not found'
};

const cvRouterError = {
  NOT_FOUND: 'Cannot continue: data not found',
  INTERNAL_SERVER_ERROR: 'Cannot continue: internal server error.'
};

const authError = {
  NOT_AUTHORIZED: 'Cannot continue: user not authorized.'
};

module.exports = {
  userRouterError,
  cvRouterError,
  authError
};
