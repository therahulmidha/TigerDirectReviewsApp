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
const express = require('express');
const app = express();

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/httpServer')(app);

if (app.get("env") === "production") {
    require('./startup/prod')(app);
}

