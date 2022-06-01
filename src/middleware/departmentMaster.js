const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");
const {
    ensurejwtAuthorized
} = require("./auth");
const db = require("../lib/database/query");

const {getDepartmentHandler} = require('./Handlers/DepartmentMHandler')

module.exports.getDepartmentMasterData = async (event) => {
    let {
        company_id,
        company_name
    } = JSON.parse(event.body);
    var data;
    try {
        // if a company was specified, then return the departments only for that company. Otherwise return all departments
        if (company_id) {
            const company = await connection.query(
                `SELECT * from company_master where id = '${company_id}'`
            );
            let {
                id
            } = company[0];

            data = await connection.query(
                `SELECT id, name as department_name, company_id
            FROM department_master where company_id = ${id} and active = 1`
            );
        } else if (company_name) {
            const company = await connection.query(
                `SELECT * from company_master where name = '${company_name}'`
            );
            let {
                id
            } = company[0];

            data = await connection.query(
                `SELECT id, name as department_name, company_id
            FROM department_master where company_id = ${id} and active = 1`
            );
        } else {
            data = await connection.query(
                `SELECT id, name as department_name, company_id
            FROM department_master where active = 1`
            );
        }
        await connection.end();
        return handler.returner([true, data], 'Get company master data successfully!!', 200);
    } catch (error) {
        await connection.end();
        console.log("error: ", error);
        return handler.returner([false, error], 'Get company master data failed!!', 500);
    }
};

module.exports.create_department = async (event) => {
    return create_department_handler(event);
    //return await ensurejwtAuthorized(event, create_department_handler);

};

module.exports.delete_department = async (event) => {
    return delete_department_handler(event);
    return await ensurejwtAuthorized(event, delete_department_handler);
};
module.exports.update_department = async (event) => {
    return update_department_handler(event);
    // return await ensurejwtAuthorized(event, update_department_handler);
};

module.exports.getDepartment = async (event) => {
    return ensurejwtAuthorized(event, getDepartmentHandler);
}


async function update_department_handler(event) {
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var body = JSON.parse(event.body);
    const employee_id = 1; //event.user_id
    const department_id = body.department_id;
    const department_name = body.department_name;

    console.log(body);

    try {
        const data = await connection.query(
            `
            update department_master set name = '${department_name}', updated_at = '${datetime}',updated_by = ${employee_id} where id = ${department_id}
            `
        );
        await connection.end();
        return await handler.returner([true, data], 'Update department', 200);
    } catch (error) {
        await connection.end();
        console.log("error: ", error);
        return handler.returner([false, error], 'Update department', 500);
    }

}


async function delete_department_handler(event) {
    var body = JSON.parse(event.body);
    const employee_id = 1; //event.user_id
    const department_id = body.department_id;
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {


        const data = await connection.query(
            `
            delete from department_master where id = ${department_id}
            `
        );
        await connection.end();
        return await handler.returner([true, data], 'Delete department', 200);
    } catch (error) { //if the department cant be deleted due to conflict of FK
        // console.log(error)
        try {
            const dataa = await connection.query(
                `
                update department_master set active = 0, updated_at = '${datetime}',updated_by = ${employee_id} where id = ${department_id}
                `
            );
            await connection.end();
            return await handler.returner([true, dataa], 'Deactivate department', 200);
        } catch (error) {
            await connection.end();
            console.log(error);
            return handler.returner([false, error], 'Deactivate department', 500);
        }
    }
}


async function create_department_handler(event) {
    var body = JSON.parse(event.body);
    const employee_id = 1; //event.user_id
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let {
        department_name,
        company_id,
    } = body;
    try {
        const data = await connection.query(
            `
            INSERT INTO department_master (name,company_id,created_at, created_by, updated_at, updated_by,active)
           VALUES ('${department_name}', '${company_id}','${datetime}','${employee_id}', '${datetime}','${employee_id}',1);
            `
        );
        await connection.end();
        return await handler.returner([true, data], 'Create department', 200);
    } catch (error) {
        await connection.end();
        console.log("error: ", error);
        return handler.returner([false, error], 'Create department', 500);
    }
}