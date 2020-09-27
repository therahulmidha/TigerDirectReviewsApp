/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Service to retrieve reviews for a tigerdirect review page
 * This module has following exported function(s):
 * 1. getReviews - To Get list of reviews for a given url
 * 
 * And following private functions: 
 * 1. getReviewsFromCurrentPage: Get all reviews listed on the page
 * 2. getComments: Get comments for a review
 * 3. getRating: Get rating for a review
 * 4. getReviewDate: Get review date for a review
 * 5. getReviewerName: Get reviewer name for a review
 * -----------------------------------------------------------------------------------
 */
const phantom = require("phantom");
const logger = require('winston');
const messages = require('../common/messages');

/**
 * Crawl reviews from a tigerdirect review page
 * @param  {string} url
 */
async function getReviews(url) {
    try {
        const reviews = [];
        let nextButtonExists = false;
        let changedUrl = null;

        const instance = await phantom.create();
        const page = await instance.createPage();

        const pageOpenResult = await page.open(url);

        // If url was invalid, page couldn't be opened
        if (pageOpenResult !== "success") {
            await page.close();
            await instance.exit();
            return messages.UNABLE_TO_CONNECT_TO_URL;
        }

        // check if reviews exist on the page
        const reviewsFound = await page.evaluate(function () {
            return document.querySelector('#reviewtab') != null;
        });

        if (!reviewsFound) {
            await page.close();
            await instance.exit();
            return messages.NO_REVIEWS_FOUND_ON_INVALID_PAGE;
        }

        await page.evaluate(function () {
            document.querySelector('#reviewtab > a').click();
        });

        // Fetch reviews in sets of 5 reviews per page
        do {
            if (changedUrl) {
                await page.open(changedUrl);
            }

            let noOfReviewsOnCurrentPage = await page.evaluate(function () {
                return document.querySelectorAll('#customerReviews > .review').length;
            });

            await getReviewsFromCurrentPage(page, noOfReviewsOnCurrentPage, reviews);

            // Check if next button exists
            nextButtonExists = await page.evaluate(function () {
                return document.querySelector("[title='Next']") != null && document.querySelector("[title='Next']").className === "";
            });

            // if next button exists, fetch it's url
            if (nextButtonExists) {
                changedUrl = await page.evaluate(function () {
                    return document.querySelector("[title='Next']").href;
                });
            }
        }
        while (nextButtonExists);

        // close the page and exit the phantom instance
        await page.close();
        await instance.exit();

        return reviews;
    } catch (error) {
        logger.error(error.message);
        return messages.ERROR_RETRIEVING_REVIEWS;
    }
}

/**
 * Get all reviews listed on the page
 * @param  {object} page
 * @param  {number} noOfReviewsOnCurrentPage
 * @param  {array} reviews
 */
async function getReviewsFromCurrentPage(page, noOfReviewsOnCurrentPage, reviews) {
    for (let loopCounter = 0; loopCounter < noOfReviewsOnCurrentPage; loopCounter++) {
        reviews.push({
            comment: await getComments(page, loopCounter),
            rating: await getRating(page, loopCounter),
            review_date: await getReviewDate(page, loopCounter),
            reviewer: await getReviewerName(page, loopCounter)
        });
    }
    return;
}
/**
 * Get comments for a review
 * @param  {} page
 * @param  {number} reviewIndex
 */
async function getComments(page, reviewIndex) {
    return {
        title: await page.evaluate(function (index) {
            return document.querySelectorAll('#customerReviews > .review > .rightCol > blockquote')[index].querySelector('h6').textContent;
        }, reviewIndex),
        text: (await page.evaluate(function (index) {
            return document.querySelectorAll('#customerReviews > .review > .rightCol > blockquote')[index].querySelector('p').textContent;
        }, reviewIndex)).replace(/\n/g, '')
    };
}

/**
 * Get review rating for a review
 * @param  {} page
 * @param  {number} reviewIndex
 */
async function getRating(page, reviewIndex) {
    return await page.evaluate(function (index) {
        return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .itemReview > dd > .itemRating > strong").textContent;
    }, reviewIndex);
}

/**
 * Get review date for a review
 * @param  {} page
 * @param  {number} reviewIndex
 */
async function getReviewDate(page, reviewIndex) {
    return await page.evaluate(function (index) {
        return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .reviewer").getElementsByTagName('dd')[1].textContent;
    }, reviewIndex);
}

/**
 * Get reviewer name for a review
 * @param  {} page
 * @param  {number} reviewIndex
 */
async function getReviewerName(page, reviewIndex) {
    return await page.evaluate(function (index) {
        return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .reviewer").getElementsByTagName('dd')[0].textContent;
    }, reviewIndex);
}

module.exports.getReviews = getReviews;