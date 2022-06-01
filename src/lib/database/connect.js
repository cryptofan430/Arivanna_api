
"use strict"
require("dotenv").config()
console.log(`DB NAME : ${process.env.DB_NAME}`)

const connection = require("serverless-mysql")({
    connectTimeout: 3, // TODO: implement something like this. This does not work
    timeout: 2,// TODO: implement something like this. This does not work
    config: {
        acquireTimeout:3,
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
});

module.exports = connection
