require('./db/mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const userRouter = require('./routers/user');
const cvRouter = require('./routers/cv');

console.log(chalk.yellow(`App is running`));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);
app.use(cvRouter);

module.exports = app;
