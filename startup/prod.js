const helmet = require('helmet');
/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Module for configuring production environment specific modules  
 * -----------------------------------------------------------------------------------
 */
const compression = require('compression');
const helmet = require('helmet');

module.exports = function (app) {
    app.use(helmet());
    app.use(compression());
}