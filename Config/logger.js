const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    format:format.combine(
        format.colorize({ all: true }),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.splat(),
        format.simple(),

    ),
   transports:[new transports.Console()]
});

module.exports = logger;
