const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");

const db = require("../lib/database/query")

module.exports.getAllforrefiner = async (event) => {
    try {

        const companys = await connection.query(
            `SELECT id, name as company_name,active
            FROM company_master where active  <> 0`
        );

        const deps = await connection.query(
            `SELECT id, name as department_name, company_id,active
        FROM department_master  where active  <> 0`
        );
        var titles = await connection.query(
            `SELECT name,department_id,id,active
            FROM title_master  where active  <> 0`
        );

        var inactive_titles = []
        var temp_titles = []
        for (let index = 0; index < titles.length; index++) {
            const element = titles[index];
            if (element.active == '0') {
                inactive_titles.push(element)
            }
            else {
                temp_titles.push(element)
            }
        }
        titles = temp_titles
        const permissions = await connection.query(`select * from module_master  where active <> 0`)

        const defaults = await db.select_all("default_permissions");


        const data = { companys, deps, titles, permissions, defaults, inactive_titles }
        await connection.end();
        return await handler.returner([true, data], 'Get company master data successfully!!', 200)
    } catch (error) {
        console.log("error: ", error)
        await connection.end();
        return handler.returner([false, error], 'Get all permissions', 500)

    }

}