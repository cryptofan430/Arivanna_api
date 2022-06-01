const { ensurejwtAuthorized } = require("./auth");
const { getLeaveSettingHandler } = require("./Handlers/LSHandler");

// resolver
const handle =  require('./handler');

// database connection!
const conn = require('../lib/database/connect');

// [GET] leave_setting given by employee policy 
module.exports.getLeaveSetting = async (event) => {
    try {
        const query = await conn.query('SELECT * FROM leave_setting;');
        return handle.returner(200, query);
    } catch (err) {
        // err handling
        console.log(err);
        throw err;
    }
    return await ensurejwtAuthorized(event, getLeaveSettingHandler);
}

