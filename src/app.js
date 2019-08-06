require('./db/mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const userRouter = require('./routers/user');
const cvRouter = require('./routers/cv');

const port = process.env.PORT || 3000;
console.log(chalk.yellow(`App is running`));

/**
 * Express
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);
app.use(cvRouter);

app.listen(port, () => {
  console.log(chalk.blue(`App listening on port ${port}`));
});
