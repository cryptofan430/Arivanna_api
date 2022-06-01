const handler = require("../handler");
const connection = require("../../lib/database/connect");


module.exports.getDesignationsHandler = async (event) => {
    try {
        const data = await connection.query(
            `SELECT 
                dm.name AS department, 
                d.name AS designation
            FROM department_master dm 
            INNER JOIN title_master d 
            ON dm.id = d.department_id`
        );    
        await connection.end();
        return handler.returner([true, data], 'Get designations master data successfully!!', 200);
    } catch (error) {
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}
