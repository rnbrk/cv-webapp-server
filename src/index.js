const chalk = require('chalk');

const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(chalk.blue(`App listening on port ${port}`));
});
