/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Module for configuring logging and common error handling 
 * -----------------------------------------------------------------------------------
 */
const { createLogger, transports, format } = require('winston');
const morgan = require('morgan');
require('express-async-errors');
let date = new Date();
let fileName = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "-";
const logger = createLogger({
    transports: [
        new transports.File({ filename: `./logs/${fileName}ERROR.log`, level: 'error',format: format.combine(format.timestamp(), format.json()) }),
        new transports.File({ filename: `./logs/${fileName}INFO.log`, level: 'info',format: format.combine(format.timestamp(), format.json()) }),
        new transports.Console({ level: 'error', format: format.combine(format.timestamp(), format.json()) }),
        new transports.Console({ level: 'info', format: format.combine(format.timestamp(), format.json()) }),
    ],
});

function initializeLogger(app) {
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

module.exports.initializeLogger = initializeLogger;
module.exports.logger = logger;