/**
 * Project Name : TigerDirectReviewsApp
 * @author  Rahul Midha
 * @date    Sept 26, 2020
 * 
 * Description
 * ----------------------------------------------------------------------------------- 
 * Main starting point file for configuring express app  
 * -----------------------------------------------------------------------------------
 */
// Express app dependencies
const express = require('express');
const app = express();

require('./startup/logging').initializeLogger(app);
require('./startup/routes')(app);
require('./startup/http-server')(app);

if (app.get("env") === "production") {
    require('./startup/prod')(app);
}

