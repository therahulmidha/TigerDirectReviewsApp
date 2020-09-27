/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Middleware function to handles errors in request-response cycle 
 * -----------------------------------------------------------------------------------
 */
const logger = require('winston');
const messages = require('../common/messages');
module.exports = function (err, req, res, next) {
    // Log the exception
    logger.error(err.message);

    if(err.message.includes("Unexpected token") || err.message.includes("JSON")){
        return res.status(500).json({
            message: messages.INCORRECT_REQUEST_BODY_DATA,
            data: null
        });
    }

    return res.status(500).json({
        message: messages.INTERNAL_SERVER_ERROR,
        data: null
    });
}