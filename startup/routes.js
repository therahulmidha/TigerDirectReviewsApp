const { json } = require('express');
const error = require('../middleware/error');
const ReviewRouter = require('../routes/api/ReviewRouter');
module.exports = function(app){
    // Middleware to allow body data to be sent in request
    app.use(json());

    // API endpoint for review
    app.use('/api/review', ReviewRouter);

    // middleware for handling internal server error
    app.use(error);
}