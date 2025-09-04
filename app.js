const assert = require('assert');

const express = require('express');
const app = express();
const {WebhookResponse} = require('@jambonz/node-client');
const basicAuth = require('express-basic-auth');
const opts = Object.assign({
  timestamp: () => `, "time": "${new Date().toISOString()}"`,
  level: process.env.LOGLEVEL || 'info'
});
const logger = require('pino')(opts);
const {processEnvProperty} = require('./lib/utils.js')(logger);
const port = process.env.HTTP_PORT || 3000;
const routes = require('./lib/routes');
app.locals = {
  ...app.locals,
  logger
};

if (process.env.HTTP_USERNAME && process.env.HTTP_PASSWORD) {
  const users = {};
  users[process.env.HTTP_USERNAME] = process.env.HTTP_PASSWORD;
  app.use(basicAuth({users}));
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (process.env.WEBHOOK_SECRET) {
  app.use(WebhookResponse.verifyJambonzSignature(process.env.WEBHOOK_SECRET));
}
app.use(processEnvProperty);
app.use('/', routes);

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Handle other errors
app.use((err, req, res, next) => {
  logger.error(err, 'burped error');
  res.status(err.status || 500).json({msg: err.message});
});

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  logger.info(`Example jambonz app listening at http://localhost:${port}`);
});
