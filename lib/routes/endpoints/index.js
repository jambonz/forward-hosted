const router = require('express').Router();

router.use('/status', require('./call-status'));
router.use('/', require('./dial'));

module.exports = router;
