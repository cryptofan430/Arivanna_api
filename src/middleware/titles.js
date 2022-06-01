const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");
const { ensurejwtAuthorized } = require("./auth");

const db = require("../lib/database/query");

module.exports.get_titles = async (event) => {
    return await ensurejwtAuthorized(event, async () => {
        try {
           const titles = await db.select_all("title_master");
           await connection.end();
            return handler.returner([true, titles], 'Titles', 200);
        } catch (error) {
            console.log(error)
            await connection.end();
            return handler.returner([false, error], 'Internal server errors', 500);
        }
    });
};


module.exports.create_title = async (event) => {
    return await ensurejwtAuthorized(event, create_title_handler);
}

module.exports.delete_title = async (event) => {
    // return delete_title_handler(event)
    return await ensurejwtAuthorized(event, delete_title_handler);
}

module.exports.update_title = async (event) => {
    //return update_title_handler(event)
    return await ensurejwtAuthorized(event, update_title_handler);
}

async function update_title_handler(event) {
    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    var body = JSON.parse(event.body)
    const employee_id = event.user_id
    const title_id = body.title_id
    const title_name = body.title_name

    try {
        const data = await connection.query(
            `update title_master set 
                name = '${title_name}', 
                updated_at = '${date_time}',
                updated_by = ${employee_id} where id = ${title_id}
            `
        );
        await connection.end();
        return await handler.returner([true, data], 'Create Title', 200)
    } catch (error) {
        console.log("error: ", error)
        await connection.end();
        return handler.returner([false, error], 'Create Title', 500)
    }
}

async function delete_title_handler(event) {
    var body = JSON.parse(event.body)
    console.log("tttt: ",body)
    const employee_id = event.user_id
    const title_id = body.title_id

    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    try {
        const data = await connection.query(`delete from title_master where id = ${title_id}`);
        return await handler.returner([true, data], 'Delete Title', 200)
    } catch (error) {       // if the title cant be deleted due to conflict of FK
        try {
            const data = await connection.query(
                `update title_master set 
                    active = 0, 
                    updated_at = '${date_time}',
                    updated_by = ${employee_id} where id = ${title_id}`
            );
            await connection.end();
            return await handler.returner([true, data], 'Deactivate Title', 200)
        } catch (error) {
            console.log(error)
            await connection.end();
            return handler.returner([false, error], 'Deactivate Title', 500)
        }
    }
}

async function create_title_handler(event) {
    var body = JSON.parse(event.body)
    const employee_id = event.user_id
    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    let { title_name,
        department_id,
    } = body
    try {
        const data = await connection.query(
            ` INSERT INTO title_master (
                name,
                department_id,
                created_at, 
                created_by, 
                updated_at, 
                updated_by,active)
           VALUES (
               '${title_name}', 
               '${department_id}',
               '${date_time}',
               '${employee_id}', 
               '${date_time}',
               '${employee_id}',
               1);
            `
        );
        await connection.end();
        return await handler.returner([true, data], 'Create Title', 200)
    } catch (error) {
        console.log("error: ", error)
        await connection.end();
        return handler.returner([false, error], 'Create Title', 500)
    }

}
