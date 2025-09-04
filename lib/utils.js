const path = require('path');
const {mergeEnvVarsWithDefaults} = require('@jambonz/node-client');
const schema = require(path.join(process.cwd(), 'app.json'));

module.exports = (logger) => {
  /**
   * Middleware function to process environment properties from request body
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  const processEnvProperty = (req, res, next) => {
    if (req.path === '/call-status') {
      return next();
    }
    req.locals = req.locals || {};
    if (req.method === 'POST' && req.body && req.body.env_vars) {
      req.locals.env_vars = req.body.env_vars;
      delete req.body.env_vars;
    }
    else req.locals.env_vars = {};

    /* marge defaults from app.json for anything not supplied */
    req.locals.env_vars = mergeEnvVarsWithDefaults(req.locals.env_vars, req.path, schema);

    next();
  };
  return {
    processEnvProperty
  };
};
