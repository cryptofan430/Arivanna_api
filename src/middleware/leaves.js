const {
    ensurejwtAuthorized
} = require("./auth");
const {
    getAdminLeavesHandler,
    getEmployeeLeavesHandler
} = require("./Handlers/LeavesHandler");
const jwt = require("jsonwebtoken");

// resolver
const handle = require('./handler')
// database connection
const conn = require('../lib/database/connect');
// jwt private key
const PRIVATE = "4f93ac9d10cb751b8c9c646bc9dbccb9";

// [GET] admin leaves with auth token
module.exports.getAdminLeaves = async (event) => {
    try {
        const token = event.headers.Authorization.split(' ')[1];
        const access = jwt.verify(token, PRIVATE);

        // const result = await conn.query(
        //     `SELECT * FROM sys.employee WHERE id="${access.sub}";`
        // );

        // find leaves by id
        const leaves = await conn.query(
            `SELECT id FROM leave WHERE employee_id="${access.sub}";`
        );

        handle.returner(200, leaves);

    } catch (error) {
        // error handling
        console.log(error);
        throw error;
    }
    return await ensurejwtAuthorized(event, getAdminLeavesHandler);
}

module.exports.getEmployeeLeaves = async (event) => {
    try {
        const token = event.headers.Authorization.split(' ')[1];
        const access = jwt.verify(token, PRIVATE);

        // const result = await conn.query(
        //     `SELECT * FROM sys.employee WHERE id="${access.sub}";`
        // );

        // find leaves by id
        const leaves = await conn.query(
            `SELECT id FROM leave WHERE employee_id="${access.sub}";`
        );

        handle.returner(200, leaves);

    } catch (error) {
        // error handling
        console.log(error);
        throw error;
    }
    return await ensurejwtAuthorized(event, getEmployeeLeavesHandler);
}