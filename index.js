// Express app dependencies
const express = require('express');
const app = express();

require('./startup/logging')(app);
require('./startup/routes')(app);
require('./startup/http-server')(app);


