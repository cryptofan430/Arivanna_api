
// Queries Handlers
const handler = require("../middleware/handler");

const db = require("../lib/database/query");

// Auth
const { ensurejwtAuthorized } = require("./auth");

// [GET] employee permission with auth token
module.exports.get_default_permissions_for_title = async (event) => {
    return await ensurejwtAuthorized(event, default_permissions_for_titleHandler);
};

module.exports.get_default_permission_by_title_id = async (event) => {
    try {
        const { title_id } = event.pathParameters;
        const data = await db.select_all_with_condition("default_permissions", { title_id });
        return handler.returner([true, data], 'Default Permissios of the title', 200);
    } catch (error) {
        console.log(error);
        return handler.returner([false, error], 'Internal server errors', 500);
    }


    // return handler.returner([true, a], 'Employee profile data!!', 200);
};

default_permissions_for_titleHandler = async () => {
    try {
        const a = await db.select_all("default_permissions");
        return handler.returner([true, a], 'Employee profile data!!', 200);
    } catch (error) {
        console.log(error);
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};