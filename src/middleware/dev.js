
const handler = require("../middleware/handler");
const db = require('../lib/database/query');

// Connection import
const connection = require("../lib/database/connect");

module.exports.real_delete_employee_date = async (event) => {
    let reqBody = JSON.parse(event.body)
    employee_id = reqBody.employee_id
    console.log("yessss", employee_id)

    await deletea("module_permission_master", "employee_id", employee_id)
    await deletea("family_info", "employee_id", employee_id)
    await  deletea("experience", "employee_id", employee_id)
    await deletea("education", "employee_id", employee_id)
    await deletea("profile_master", "employee_id", employee_id)
    await  deletea("employee", "employee_id", employee_id)
}


async function deletea(table, col_to_match, employee_id) {
    try {
        var result = await connection.query(
            `DELETE FROM ${table} WHERE ${col_to_match} = ${employee_id}`
        )
        await connection.end();
      //  console.log("Deleted succefully from: ", table)
    } catch (error) {
        await connection.end();
        console.log("failed to delete from: ", table)
        console.log(error)
        
    }
    
}