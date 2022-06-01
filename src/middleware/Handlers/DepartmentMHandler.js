// Queries Handlers
const handler = require("../handler");
const db = require('../../lib/database/query');

module.exports.getDepartmentMasterHandler = async (event) => {
    try {
        const data = await db.select_many("department_master", ["id", "name AS department"]);
        return handler.returner([true, data], 'Get department master data successfully!!', 200);
    } catch (error) {
        return handler.returner([false, ''], 'Internal server error.', 500);        
    }
}

module.exports.getDepartmentHandler = async (event) => {
    // the id of the department requested
    const id = event.pathParameters.id;    
    try {
        const data = await db.search_one("department_master", "company_id", id);
        return handler.returner([true, data], 'Get department master data successfully!!', 200);
    } catch (error) {
        return handler.returner([false, ''], 'Internal server error.', 500);        
    }
}