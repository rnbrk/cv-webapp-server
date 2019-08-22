require('./db/mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRouter = require('./routers/user');
const cvRouter = require('./routers/cv');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8080',
  methods: 'GET,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);
app.use(cvRouter);

module.exports = app;
