// Express app dependencies
const express = require('express');
const app = express();
const config = require('config');
const { json } = require('express');
const morgan = require('morgan');

// Enable morgan response logger for development env
if (app.get("env") === "development") {
    app.use(morgan("dev"));
}

// Http server
const ip = config.get("server.ip");
const port = process.env.PORT || config.get("server.port");
app.listen(port, ip, () => {
    console.log(`Server started on http://${ip}:${port}`);
});

// Middleware to allow body data to be sent in request
app.use(json());

// API endpoint for review
app.use('/api/review', require('./routes/api/ReviewRouter'));