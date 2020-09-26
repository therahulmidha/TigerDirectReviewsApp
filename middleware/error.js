// const log = require('winston');
module.exports = function (err, req, res, next) {
    // Log the exception
    logger.error(err);
    return res.status(500).json({
        message: 'Internal Server Error',
        data: null
    });
}