// Module dependencies
const phantom = require("phantom");

/**
 * @description Crawl reviews from a tigerdirect url
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
        console.log(pageOpenResult)
        if (pageOpenResult !== "success") {
            await page.close();
            await instance.exit();
            return 'Unable to connect to the provided url';
        }

        // Check if error page attributes present on opening the page
        const isInvalidPage = await page.evaluate(function () {
            return document.querySelector('[title="Go To Homepage"]') != null;
        });

        // tigerdirect has no valid page for the url
        if (isInvalidPage) {
            await page.close();
            await instance.exit();
            return 'Requested Page Does not exists';
        }

        // Fetch the reviews
        const noOfReviews = await page.evaluate(function () {
            return document.querySelectorAll('#customerReviews > .review').length;
        });

        // Iterate through the reviews section and create a review object
        const reviews = [];
        for (let i = 0; i < noOfReviews; i++) {
            let obj = {};
            let commentObj = {};

            commentObj.title = await page.evaluate(function (index) {
                return document.querySelectorAll('#customerReviews > .review > .rightCol > blockquote')[index].querySelector('h6').textContent;
            }, i);

            commentObj.text = await page.evaluate(function (index) {
                return document.querySelectorAll('#customerReviews > .review > .rightCol > blockquote')[index].querySelector('p').textContent;
            }, i);

            obj.comment = commentObj;

            obj.rating = await page.evaluate(function (index) {
                return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .itemReview > dd > .itemRating > strong").textContent;
            }, i);

            obj.review_date = await page.evaluate(function (index) {
                return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .reviewer").getElementsByTagName('dd')[1].textContent;
            }, i);

            obj.reviewer = await page.evaluate(function (index) {
                return document.querySelectorAll('#customerReviews > .review')[index].querySelector(".leftCol > .reviewer").getElementsByTagName('dd')[0].textContent;
            }, i);
            reviews.push(obj);
        }

        // close the page and phantom instance and return the reviews
        await page.close();
        await instance.exit();
        return reviews;
    } catch (error) {
        console.log(error);
    }
}

module.exports.getReviews = getReviews;