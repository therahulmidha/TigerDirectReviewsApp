/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Module for configuring routes and middleware 
 * -----------------------------------------------------------------------------------
 */
const { json } = require('express');
const error = require('../middleware/error');
const ReviewRouter = require('../routes/api/ReviewRouter');
module.exports = function (app) {
    // Middleware to allow body data to be sent in request
    app.use(json());

    // API endpoint for review
    app.use('/api/review', ReviewRouter);

    // middleware for handling internal server error
    app.use(error);

    // Middleware for unknown endpoints
    app.use(function (req, res, next) {
        return res.status(404).send({
            message: 'Route ' + req.url + ' Not found.',
            data: null
        });
    });
}