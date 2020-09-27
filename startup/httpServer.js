/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Module for starting http server based on environment configurations  
 * -----------------------------------------------------------------------------------
 */
const config = require('config');
const logger = require('winston');

module.exports = function (app) {
    const ip = config.get("server.ip");
    const port = process.env.PORT || config.get("server.port");
    app.listen(port, ip, () => {
        logger.info(`Server started on http://${ip}:${port}`);
    });
}