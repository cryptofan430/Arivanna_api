const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");
const { ensurejwtAuthorized } = require("./auth");

const db = require("../lib/database/query")
var success = true

module.exports.create_perm_module = async (event) => {
    try {
        var body = JSON.parse(event.body)
        const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const result = await create_perm_module(body, 1, datetime)
        body.insertId = result.insertId
        body.datetime = datetime
        await ensurejwtAuthorized(event, add_prem_to_tm)
        return await handler.returner([true, result], 'Permission Create', 200)
    } catch (error) {
        console.log("error: ", error)
        return handler.returner([false, error], 'Permission Create', 500)
    }
}

module.exports.delete_perm_module = async (event) => {
    return await ensurejwtAuthorized(event, delete_perm_module_handler)
}

module.exports.update_perm_module = async (event) => {
    return await ensurejwtAuthorized(event, update_perm_module_handler)
}

async function update_perm_module_handler(event) {

    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    var body = JSON.parse(event.body)
    const employee_id = event.user_id
    const id = body.id

    // console.log(body)


    try {
        const data = await connection.query(
            `
            update module_master set 
            name = '${body.perm_name}',
            type= '${body.type}',
            notes= '${body.notes}',
            url= '${body.url}',
            comp_tag_id= '${body.comp_tag_id}',
             updated_at = '${datetime}',
             updated_by = ${employee_id} 
             where id = ${id}
            `
        );
        await connection.end();
        return await handler.returner([true, data], 'Update Permission', 200)
    } catch (error) {
        console.log("error: ", error)
        await connection.end();
        return handler.returner([false, error], 'Update Permission', 500)
    }

}

async function delete_perm_module_handler(event) {

    var body = JSON.parse(event.body)
    const employee_id = event.user_id
    const perm_id = body.perm_id
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    try {
        const data = await connection.query(
            `
                delete from module_master where id = ${perm_id}
                `
        );
        return await handler.returner([true, data], 'Delete Permission', 200)
    } catch (error) {//if the title cant be deleted due to conflict of FK
        // console.log(error)
        try {
            const dataa = await connection.query(
                `
                    update module_master set active = 0, updated_at = '${datetime}',updated_by = ${employee_id} where id = ${perm_id}
                    `
            );
            await connection.end();
            return await handler.returner([true, dataa], 'Deactivate Permission', 200)
        } catch (error) {
            console.log(error)
            await connection.end();
            return handler.returner([false, error], 'Deactivate Permission', 500)
        }
    }
}

async function create_perm_module(body, tm_id, datetime) {
    var string = "INSERT INTO module_master " +
        "(" +
        "`name`" + " , " +
        "`type`" + " , " +
        "`is_active`" + " , " +
        "`created_at`" + " , " +
        "`created_by`" + " , " +
        "`updated_at`" + " , " +
        "`updated_by`" + " , " +
        "`url`" + " , " +
        "`active`" + " , " +
        "`comp_tag_id`" + " , " +

        "`notes`" +
        ")" +
        `VALUES ('${body.name}',
'${body.type}',
'1',
'${datetime}',
'${tm_id}', 
'${datetime}',
'${tm_id}',
'${body.url}',
'1',
'${body.comp_tag_id}',
'${body.notes}'
);
`

    //console.log("string: ", string)
    return await connection.query(string);


}

async function add_prem_to_tm(event) {
    var body = event.body
    const tm_id = event.user_id;
    let permissonObject = {}
    permissonObject.module_id = body.insertId
    permissonObject.employee_id = tm_id
    permissonObject.create = 1
    permissonObject.read = 1
    permissonObject.write = 1
    permissonObject.delete = 1
    permissonObject.import = 1
    permissonObject.export = 1
    permissonObject.is_active = 1
    permissonObject.created_by = tm_id
    permissonObject.updated_by = tm_id
    permissonObject.created_at = body.datetime
    permissonObject.updated_at = body.datetime
    const a = await db.insert_new(permissonObject, "module_permission_master")
}






module.exports.update_default_perms = async (event) => {
    return await ensurejwtAuthorized(event, update_permission_default_handler);
}


async function update_permission_default_handler(event) {
    var body = JSON.parse(event.body).data
    console.log('body', body);
    // body = event 
    var updated_create = true
    const defaults = await db.select_all("default_permissions");


    for (let index = 0; index < body.length; index++) {//goes through all the default perms that were received
        const body_element = body[index];
        const module_id = body[index].module_id;
        const title_id = body[index].title_id
        var matched = false
        for (let index = 0; index < defaults.length; index++) {//goes through the existing defaults in db
            const defaults_element = defaults[index];
            if (defaults_element.title_id == body_element.title_id && defaults_element.module_id == body_element.module_id) {
                matched = true
            }
        }
        if (matched) {
            await update_handler(body_element)
            // console.log("y")
        }
        else {
            await create_handler(body_element)
            //console.log("n")
        }
        //  console.log("loop")
    }


    if (success) {
        await connection.end();
        return await handler.returner([true, []], 'Create Title', 200)

    } else {
        await connection.end();
        return handler.returner([false, error], 'Create Title', 500)

    }


}

async function update_handler(element) {
    try {
        const data = await connection.query(
            " update default_permissions set  " +
            "`create` = " + element.create + "," +
            "`delete` = " + element.delete + "," +
            "`export` = " + element.export + "," +
            "`import` = " + element.import + "," +
            "`read` = " + element.read + "," +
            "`write` = " + element.write + " " +
            "where module_id = " + element.module_id +
            " and title_id = " + element.title_id
        );
    } catch (error) {
        success = false
        console.log("error: ", error)

    }

}
async function create_handler(element) {

    var string = "INSERT INTO default_permissions " +
        "(" +
        "`create`" + " , " +
        "`delete`" + " , " +
        "`export`" + " , " +
        "`import`" + " , " +
        "`read`" + " , " +
        "`write`" + " , " +
        "`title_id`" + " , " +
        "`module_id`" +
        ")" +

        `VALUES ('${element.create}',
  '${element.delete}',
  '${element.export}',
  '${element.import}',
  '${element.read}', 
  '${element.write}',
  '${element.title_id}',
  '${element.module_id}'
  );
`

    //console.log("string: ", string)
    const data = await connection.query(string);
}
