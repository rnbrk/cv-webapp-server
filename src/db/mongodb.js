const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useCreateIndex: true
});

const db = mongoose.connection;
