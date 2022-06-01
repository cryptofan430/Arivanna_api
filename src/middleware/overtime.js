const { ensurejwtAuthorized } = require("./auth");
const {getOvertimesHandler,addOvertimeHandler,updateOvertimeHandler, deleteOvertimeHandler} = require("./Handlers/OvertimeHandler");

// [GET] /api/overtimes
module.exports.getOvertimes = async (event) => {
    return await ensurejwtAuthorized(event, getOvertimesHandler);
}

// [POST] /api/overtime
module.exports.addOvertime = async (event) => {
    return await ensurejwtAuthorized(event, addOvertimeHandler);
}

// [PUT] /api/overtime/:id
module.exports.updateOvertime = async (event) => {
    return await ensurejwtAuthorized(event, updateOvertimeHandler);
}

// [DELETE] /api/overtime/:id
module.exports.deleteOvertime = async (event) => {
    return await ensurejwtAuthorized(event, deleteOvertimeHandler);
}
