const { ensurejwtAuthorized } = require("./auth");
const { getHolidaysHandler, createHolidayHandler, updateHolidayHandler, deleteHolidayHandler } = require("./Handlers/HolidaysHandler");

// [GET] holidays with auth token
module.exports.getHolidays = async (event) => {
    return await ensurejwtAuthorized(event, getHolidaysHandler);
}

// [POST] new holiday with auth token required
module.exports.createHoliday = async (event) => {
    return await ensurejwtAuthorized(event, createHolidayHandler);
}

// [PUT] update holiday with params id with auth token required
module.exports.updateHoliday = async (event) => {
    return await ensurejwtAuthorized(event, updateHolidayHandler);
}

// [DELETE] delete holiday with params id with auth token required
module.exports.deleteHoliday = async (event) => {
    return await ensurejwtAuthorized(event, deleteHolidayHandler);
}
