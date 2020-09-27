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
const ReviewService = require('../../service/reviewService');
const logger = require('winston');
const messages = require('../../common/messages');
const mcache = require('memory-cache');
const config = require('config');
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

        let key = 'cached_url_' + req.body.url;
        
        // find if the url in request body was cached
        let cachedResponse = mcache.get(key);

        // if cached, return the response
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        } else {

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

            // Preparing the response to be cached and returned
            let responseOk = { message: `Found ${data.length} reviews`, data };
            mcache.put(key, responseOk, config.get('cache_expiration_interval'));

            logger.info(`Created cache entry for url: ${req.body.url}`)

            // Returning the 200 response
            return res.status(200).json(responseOk);
        }


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