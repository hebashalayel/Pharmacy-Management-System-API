const express = require('express');
const createError = require('http-errors');
const app = express();
const { returnJson } = require('./my_modules/json_response')
global.returnJson=returnJson
process.on('unhandledRejection', (reason) => {
    console.log(reason);
    process.exit(1);
})
const midddlewares = require('./middlewares');
midddlewares.global(app);
const routes = require('./routes');
routes(app);
//not found handler
app.use((req, res, next) => {
    const error = createError(404);
    next(error);
})
//error handler
app.use((error,req, res, next) => {
    res.status(error.status || 500).json({
        status: false,
        message:error.message
    })
})

module.exports = app;

