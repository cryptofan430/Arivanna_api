
"use strict"
const conn = require('../lib/database/connect');
const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");

const db = require("../lib/database/query")

module.exports.handler = async (event) => {



    try {



        var data = await db.select_all("test");




        await connection.end();
        return await handler.returner([true, data], 'Test DB connection Succesfully', 200)
    } catch (error) {
        console.log("error: ", error)
        await connection.end();
        return handler.returner([false, error], 'Test DB connection', 500)

    }

}

