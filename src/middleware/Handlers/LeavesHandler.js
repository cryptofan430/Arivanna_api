const handler = require("../handler");

// Connection import
const connection = require("../../lib/database/connect");

module.exports.getAdminLeavesHandler = async (event) => {
    try {
        const data = await connection.query(
            `SELECT 
                l.id,
                l.from_date AS \`from\`,
                l.to_date AS \`to\`,
                l.reason,
                ltm.type AS leavetype,
                dm.name AS role,
                ltm.is_active,
                lsm.status,
                e.user_name AS name
            FROM (((((leave l 
            INNER JOIN leave_type_master ltm ON l.leave_type_id = ltm.id)
            INNER JOIN leave_status_master lsm ON lsm.id = l.status_id)
            INNER JOIN employee e ON e.id = l.employee_id)
            INNER JOIN role_master r ON e.roll_id = r.id AND r.roll_name = "admin")
            INNER JOIN title_master dm ON dm.id = e.designation_id)`
        );
        connection.quit()
        return handler.returner([true, data], 'Get admin leaves data successfully!!', 200);
    } catch (error) {
        connection.quit()
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

module.exports.getEmployeeLeavesHandler = async (event) => {
    try {
        const data = await connection.query(
            `SELECT 
                l.id,
                l.from_date AS \`from\`,
                l.to_date AS \`to\`,
                l.reason,
                ltm.type AS leavetype,
                dm.name AS role,
                ltm.is_active,
                lsm.status,
                e.user_name AS name
            FROM (((((leave l 
            INNER JOIN leave_type_master ltm ON l.leave_type_id = ltm.id)
            INNER JOIN leave_status_master lsm ON lsm.id = l.status_id)
            INNER JOIN employee e ON e.id = l.employee_id)
            INNER JOIN role_master r ON e.roll_id = r.id AND r.roll_name = "employee")
            INNER JOIN title_master dm ON dm.id = e.designation_id)`
        );
        connection.quit()
        return handler.returner([true, data], 'Get admin leaves data successfully!!', 200);
    } catch (error) {
        connection.quit()
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}
