/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Route to retrieve reviews for a tigerdirect review page
 * This module has following routes:
 * 1. / {GET}- To Get list of reviews for a given url
 * -----------------------------------------------------------------------------------
 */
const router = require('express').Router();
const Joi = require('joi');
const ReviewService = require('../../service/ReviewService');
const { logger } = require('../../startup/logging');
const messages = require('../../common/messages');

/**
 * GET all reviews for a given tigerdirect url
 * @param  {string} '/'
 * @param  {function} 'request response middleware function'
 */
router.get('/', async (req, res, next) => {
    try {
        // Validate request body for url presence
        const { error } = validateRequestBody(req.body);
        // throw new Error('samepl')
        if (error) {
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
            return res.status(404).json({ message: messages.NO_REVIEWS_FOUND_ON_VALID_PAGE, data: null });
        }

        // Return retrieved reviews
        return res.status(200).json({ message: `Found ${data.length} reviews`, data });
    } catch (error) {
        next(error);
    }
});

/**
 * Validate request body
 * @param  {object} data
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