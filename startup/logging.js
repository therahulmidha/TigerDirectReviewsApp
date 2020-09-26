const winston = require('winston');
const morgan = require('morgan');
require('express-async-errors');
module.exports = function (app) {


    global.logger = winston.createLogger({
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            //
            new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
            new winston.transports.File({ filename: './logs/debug.log', level: 'debug' }),
            // new winston.transports.File({ filename: 'combined.log' }),
        ],
    });

    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, ex);
        process.exit(1);
    });

    process.on('unhandledRejection', (ex) => {
        logger.error(ex.message, ex);
        process.exit(1);
    });


    // Enable morgan response logger for development env
    if (app.get("env") === "development") {
        app.use(morgan("dev"));
    }
}