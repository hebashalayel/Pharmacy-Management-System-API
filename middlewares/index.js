const express = require('express');
module.exports = {
    global: (app) => {
        //middleware recive all requests before route
        // app.use((req, res, next) => {
        //     const lang = req.query.lang;
        //     if (lang && (lang === 'en' || lang === 'ar')) {
        //         return next();
        //     }
        //     res.status(400).json({
        //         message: "Lang is require"
        //     })
        // })
        app.use((req, res, next) => {
            //some check
            next();
        })
        app.use(express.json())
    },
    auth:require('./auth')
}
