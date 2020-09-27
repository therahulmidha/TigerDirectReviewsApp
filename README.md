# TigerDirectReviewsApp

This application provides an api to fetch reviews form tigerdirect.com's review pages. 

Some of such pages have urls like: 

https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=3415706

https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=3415697

## Accessing the API

The api provided can be accessed via GET method and endpoint: /api/review

For example: http://127.0.0.1:3000/api/review

This endpoint expects body data to be sent in following format:

{
   "url":"https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=3415706"
}

And the response received will be in following format:

{
    "message": "Found 2 reviews",
    "data": [
        {
            "comment": {
                "title": "Good reliable",
                "text": "This is the second i got for our office.\nIt quite fast and reliable. \nThe Toner easy to get and there is a lot of info how to get the maximum life and use on the internet..\nLove it"
            },
            "rating": "5.0",
            "review_date": "Feb 22, 2014",
            "reviewer": "Dias"
        },
        {
            "comment": {
                "title": "Fine printer",
                "text": "Very nice printer.  Easy install and performs well; like HP printers used to be."
            },
            "rating": "4.8",
            "review_date": "Jun 07, 2013",
            "reviewer": "pcBuilder"
        }
    ]
}

## Response time

Please note that the response time shall be dependent on the internet connection speed on which this application will be running.

## Running the application

To start this application in production environment, make sure the NODE_ENV environment variable is set as production. If not, run the following command in terminal:

For windows: 
setx NODE_ENV production  

For MAC/Linux:
export NODE_ENV=production

Also, this app uses pm2 to start the application, which must be installed in global scope of the system.

npm i -g pm2

To start the application, type in:

npm run production

in the root of the application folder where index.js is present i.e. /TigerDirectReviewsApp. This will create a running instance of the application with the name "tigerdirectreviewsapp"

To stop the application instance, type in:

npm run stop

---
## Author

Rahul Midha


