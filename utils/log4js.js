const log4js = require('log4js');

log4js.configure({
  appenders: { file: { type: 'file', filename: 'logs/app_client.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } },
});
const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = {
  logger,
};
