// Module dependencies
const router = require('express').Router();
const Joi = require('joi');
const ReviewService = require('../../service/ReviewService')

/**
 * @description GET all reviews for a given tigerdirect url
 * @param  string '/'
 * @param  function 'request response middleware function'
 */
router.get('/', async (req, res) => {
    try {
        // Validate request body for url presence
        const { error } = validateRequestBody(req.body);

        // If errors found
        if (error) {
            // Return error message
            return res.status(400).json({ message: error.details[0].message, data: null });
        }

        // Get reviews for the provided url
        let data = await ReviewService.getReviews(req.body.url);

        // If data not object, it means url was not correct
        if (typeof data != "object") {
            return res.status(400).json({ message: data, data: null });
        }

        // If no reviews were found
        if (data.length === 0) {
            return res.status(400).json({ message: 'No reviews found', data: null });
        }

        // Return retrieved reviews
        return res.json({ message: `Found ${data.length} reviews`, data });
    } catch (error) {
        // Internal Server Error
        return res.status(500).json({
            message: 'Internal Server Error',
            data: null
        })
    }
});

/**
 * @description Validate request body
 * @param  {} data
 */
const validateRequestBody = (data) => {
    const schema = Joi.object({
        // url should be of type string and is required
        url: Joi.string().required(),
    });
    // validate and return the validated result
    return schema.validate(data);
};

module.exports = router;