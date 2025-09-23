const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const {env_vars} = req.locals;
  logger.debug({payload: req.body}, 'POST /');
  try {
    const app = new WebhookResponse();
    app.dial({
      answerOnBridge: true,
      callerId: env_vars.callerId ? env_vars.callerId : req.body.from,
      target: [
        {
          type: 'phone',
          number: env_vars.number ? env_vars.number : req.body.to,
          trunk: env_vars.carrier,
        }
      ]
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

const path = require('path');
const { validateAppConfig, getAppConfig } = require('@jambonz/node-client');
const appJsonPath = path.join(__dirname, '../../../app.json');
const appJson = require(appJsonPath);

router.options('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.info(`OPTIONS request received for path: ${req.baseUrl}`);

  // First validate the app.json using SDK's validation
  const validationResult = validateAppConfig(appJson);
  if (!validationResult.isValid) {
    logger.error({ errors: validationResult.errors }, 'app.json validation failed');
    return res.status(500).json({
      error: 'Invalid app.json configuration',
      details: validationResult.errors
    });
  }

  // Get the appropriate configuration using SDK's getAppConfig
  const result = getAppConfig({ urlPath: req.baseUrl, appJsonPath });
  if (!result.success) {
    logger.error(result.error);
    return res.status(500).json({ error: result.error });
  }

  logger.debug({ config: result.config }, 'Returning configuration');
  res.json(result.config);
});

module.exports = router;
