const express = require("express");
const http = require("http");
const winston = require('winston');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();

// Assign port and create server
const port = parseInt(process.env.PORT, 10) || '4000';
app.set('port', port);

app.use(logger('dev'));

winston.info('adding middleware - body parser...');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

winston.info('Configure routes...');

// Catch all other routes.
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to Mai PMS.',
}));

try {
  const server = http.createServer(app);
  //Listen on assigned port
  server.listen(port, () => winston.info(`App running on localhost:${port}`));
} catch (e) {
  winston.error(`Error startig servers`, e);
}

module.exports = app;
