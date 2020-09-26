// Module dependencies
const phantom = require("phantom");

/**
 * @description Crawl reviews from a tigerdirect review page
 * @param  string url
 */
async function getReviews(url) {
    try {
        // Create phantom instance and a new headless browser page
        const instance = await phantom.create();
        const page = await instance.createPage();

        // open the url
        const pageOpenResult = await page.open(url);

        // If url was invalid, page couldn't be opened
        if (pageOpenResult !== "success") {
            await page.close();
            await instance.exit();
            return 'Unable to connect to the provided url';
        }

        // check if reviews exist on the page
        const isInvalidPage = await page.evaluate(function () {
            // return document.querySelector('[title="Go To Homepage"]') != null;
            return document.querySelector('#reviewtab') == null;
        });

        // No reviews found on the requested page
        if (isInvalidPage) {
            await page.close();
            await instance.exit();
            return 'No reviews found on the requested page';
        }

        // click the Reviews tab
        await page.evaluate(function () {
            document.querySelector('#reviewtab > a').click();
        });

        // Reviews array to store all retrieved reviews
        const reviews = [];

        // Variable for iterating through all reviews listed on website in paginated as 5 reviews per page
        let nextButtonExists = false;

        // Variable to keep url of next page to be opened after each page's review processing
        let changedUrl = null;

        // do-while lopp to fetch reviews in sets of 5 reviews per page
        do {

            // If changedUrl is not null, open this url
            if (changedUrl) {
                await page.open(changedUrl);
            }

            // Fetch the reviews count
            let noOfReviewsOnCurrentPage = await page.evaluate(function () {
                return document.querySelectorAll('#customerReviews > .review').length;
            });

            // Iterate through the reviews section and create a review object
            for (let loopCounter = 0; loopCounter < noOfReviewsOnCurrentPage; loopCounter++) {
                let singleReviewObject = {};
                let commentObject = {};

                // Comment title and text as one object
                commentObject.title = await page.evaluate(function (index) {
                    return document.querySelectorAll('#customerReviews > .review > .rightCol > blockquote')[index].querySelector('h6').textContent;
                }, loopCounter);

                commentObject.text = await page.evaluate(function (index) {
                    return document.querySelectorAll('#customerReviews > .review > .rightCol > blockquote')[index].querySelector('p').textContent;
                }, loopCounter);

                // assigning as a single review property
                singleReviewObject.comment = commentObject;

                // fetching rating for current review object
                singleReviewObject.rating = await page.evaluate(function (index) {
                    return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .itemReview > dd > .itemRating > strong").textContent;
                }, loopCounter);

                // fetching review date for current review object
                singleReviewObject.review_date = await page.evaluate(function (index) {
                    return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .reviewer").getElementsByTagName('dd')[1].textContent;
                }, loopCounter);

                // fetching reviewer name for current review object
                singleReviewObject.reviewer = await page.evaluate(function (index) {
                    return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .reviewer").getElementsByTagName('dd')[0].textContent;
                }, loopCounter);

                // pushing this single object to main reviews array
                reviews.push(singleReviewObject);
            }

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

        // Return the reviews
        return reviews;
    } catch (error) {
        console.log(error);
        return 'An Error occured while fetching the reviews'
    }
}

module.exports.getReviews = getReviews;