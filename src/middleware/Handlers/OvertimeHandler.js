const handler = require("../handler");
const conn = require('../../lib/database/connect');
const db = require('../../lib/database/query');

// [GET] /api/overtime get all overtime
module.exports.getOvertimesHandler = async () => {
    try {
        // get all overtime
        const data = await conn.query(
            `SELECT 
                om.id, 
                e.first_name as name,
                e.roll_id,
                e.employee_id,
                om.date as otdate, 
                om.hours as othours,
                om.description, 
                om.type as ottype, 
                om.approved_by as approvedby, 
                s.status FROM 
                (
                    (leave_status_master s 
                        INNER JOIN 
                    overtime_master om ON s.id = om.status_id
                    )
                    INNER JOIN employee e ON om.employee_id = e.id
                )
            `
        );

        // return overtime
        await conn.end();
        return handler.returner([true, data], 'Get Overtime successfully!!', 200)
    } catch (error) {
        await conn.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

// [POST] /api/overtime add new overtime
module.exports.addOvertimeHandler = async (event) => {
    // logged in user id
    const created_by = event.user_id;
    
    // parse the body
    const {
        employee_id, otdate, othours, description, 
        ottype, approvedby, created_at, updated_at
    } = JSON.parse(event.body);

    try {
        const res = await conn.query(
            `INSERT INTO overtime_master (employee_id, date, hours, description, type, status_id, approved_by, created_at, created_by, updated_at, updated_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            // updated by is as same as created by
            [parseInt(employee_id), otdate, parseInt(othours), description, ottype, 1, parseInt(approvedby), created_at, parseInt(created_by), updated_at, parseInt(created_by)]
        );

        // TODO(Umar): make it general
        const data = await conn.query(
            `SELECT 
                om.id, 
                e.first_name as name,
                e.roll_id,
                e.employee_id,
                om.date as otdate, 
                om.hours as othours,
                om.description, 
                om.type as ottype, 
                om.approved_by as approvedby, 
                s.status FROM 
                (
                    (leave_status_master s 
                        INNER JOIN 
                    overtime_master om ON s.id = om.status_id
                    )
                    INNER JOIN employee e ON om.employee_id = e.id
                )
                where om.id = ${res.insertId}
            `
        );
        await conn.end();
        return handler.returner([true, data[0]], 'Add Overtime successfully!!', 200)
    } catch (error) {
        console.log(error);
        await conn.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

module.exports.updateOvertimeHandler = async (event) => {
    // the id of the overtime
    const id = event.pathParameters.id;

    // logged in user id
    const updated_by = event.user_id;
    
    // parse the body
    const {
        otdate, othours, description, updated_at
    } = JSON.parse(event.body);

    try {
        await conn.query(
            `UPDATE overtime_master SET date = ?, hours = ?, description = ?, updated_at = ?, updated_by = ? WHERE id = ?`,
            [otdate, othours, description, updated_at, updated_by, id]
        );

        // TODO(Umar): make it general
        const data = await conn.query(
            `SELECT 
                om.id, 
                e.first_name as name,
                e.roll_id,
                e.employee_id,
                om.date as otdate, 
                om.hours as othours,
                om.description, 
                om.type as ottype, 
                om.approved_by as approvedby, 
                s.status FROM 
                (
                    (leave_status_master s 
                        INNER JOIN 
                    overtime_master om ON s.id = om.status_id
                    )
                    INNER JOIN employee e ON om.employee_id = e.id
                )
                where om.id = ${id}
            `
        );
        await conn.end();
        return handler.returner([true, data[0]], 'Update Overtime successfully!!', 200);
    } catch (error) {
        await conn.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

module.exports.deleteOvertimeHandler = async (event) => {
    // the id of the overtime
    const id = event.pathParameters.id;

    try {
        await conn.query(
            `DELETE FROM overtime_master WHERE id = ?`,
            [id]
        );
        await conn.end();
        return handler.returner([true, ''], 'Delete Overtime successfully!!', 200);
    } catch (error) {
        await conn.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}
