// Queries Handlers
const handler = require("../../middleware/handler");
const db = require('../../lib/database/query');

// Connection import
const connection = require("../../lib/database/connect");




module.exports.getEmployeeqtyHandler = async (event, basic) => {
    try {
        const users = await db.select_all_from_join_custom_joint('employee', 'title_master', 'employee.designation_id = title_master.id');
        const reducer = (previousValue, currentValue) => previousValue + currentValue;
        var employee_qty = users.map(async(item, index) => {
            if (item.name != 'Job Seeker' & item.is_active == 1) {
                await connection.end();
                return 1;
            }
            else {
                await connection.end();
                return 0;
            }
        });
        if (basic) {
            await connection.end();
            return employee_qty.reduce(reducer);
        }
        else {
            await connection.end();
            return handler.returner([true, { employee_qty: employee_qty.reduce(reducer) }], 'Get employee qty successfully', 200);
        }
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

// [HANDLE] get employee permissions
module.exports.getEmployeePermissionHandler = async (event) => {
    const employee_id = event.user_id;
    try {
        const data = await connection.query(
            `SELECT 
                em.employee_id
             FROM employee em
             LEFT JOIN company_master cm ON cm.id = em.company_id
             LEFT JOIN department_master dm ON dm.id  =  em.department_id
             LEFT JOIN title_master desMast ON desMast.id = em.designation_id
             WHERE em.employee_id = '${employee_id}'`
        );

        for (let ele of data) {
            const permission = await connection.query(`
                SELECT 
                    mm.name,
                    mm.url,
                    mm.type,
                    mpm.*
                FROM module_permission_master mpm 
                LEFT JOIN module_master mm ON mm.id = mpm.module_id
                WHERE mpm.employee_id =  ${ele.employee_id}
            `);

            const roll = await connection.query(`
                SELECT rm.roll_name FROM role_master rm, employee e WHERE e.id = '${employee_id}' && rm.id = e.roll_id;
            `);

            ele.module_permission = permission;
            ele.roll_type = roll;
        }

        //   console.log("data: ",data[0])
        // console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEE: ", data[0])
        connection.quit();
        return handler.returner([true, data[0]], 'Employee permissions data', 200);
    } catch (error) {
        console.log(error);
        connection.quit();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

// [HANDLE] get single employee data
module.exports.getEmployeeHandler = async (event) => {
    try {
        const employee_id = event.user_id;

        const emp = await db.search_one("employee", 'employee_id', employee_id);
        const emp_id = emp[0].id;
        const experience = await db.search_one("experience", 'employee_id', employee_id);
        const education = await db.search_one("education", 'employee_id', employee_id);
        const family_info = await db.search_one("family_info", 'employee_id', employee_id);
        const profile = await db.search_one("profile_master", 'employee_id', employee_id);

        const data = { emp, experience, education, family_info, profile };
        connection.quit();
        return handler.returner([true, data], 'Single employee data!!', 200);
    } catch (error) {
        console.log(error);
        connection.quit();
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};

module.exports.getSingleEmployeeHandler = async (event) => {
    try {
        const employee_id = event.pathParameters.id;

        const emp = await db.search_one("employee", 'id', employee_id);
        // TODO(Umar): redundant, make own query
        delete emp[0].is_active;
        delete emp[0].created_at;
        delete emp[0].updated_at;
        delete emp[0].created_by;
        delete emp[0].updated_by;
        delete emp[0].addr_street_number;
        delete emp[0].addr_street_name;
        delete emp[0].addr_town;
        delete emp[0].addr_city;
        delete emp[0].addr_state;
        delete emp[0].addr_country;
        delete emp[0].addr_zip_code;
        delete emp[0].addr_apt_number;
        delete emp[0].gender;
        delete emp[0].img_url;

        const company_name = await db.select_columns_with_condictions(["name AS company_name"], "company_master", "id", emp[0].company_id);
        const des_name = await db.select_columns_with_condictions(["name AS des_name"], "title_master", "id", emp[0].designation_id);
        const dept_name = await db.select_columns_with_condictions(["name AS dept_name"], "department_master", "id", emp[0].department_id);
        const module_permission = JSON.parse((await this.getEmployeePermissionHandler(event)).body).data.module_permission;

        const data = {
            ...emp[0],
            ...company_name[0],
            ...des_name[0],
            ...dept_name[0],
            module_permission: module_permission.filter(ele => ele.employee_id !== emp[0].employee_id)
        };
        return handler.returner([true, data], 'Single employee data!!', 200);
    } catch (error) {
        
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};

module.exports.updateEmployeeHandler = async (event) => {
    const employee_id = event.pathParameters.id;
    const {
        first_name,
        last_name,
        user_name,
        email,
        phone,
        password,
        joining_date,
        company_id,
        department_id,
        designation_id,
        roll_id,
        updated_at,
        updated_by,
        module_permission
    } = JSON.parse(event.body);

    try {
        await connection.query(`
            UPDATE employee SET
                first_name = '${first_name}',
                last_name = '${last_name}',
                user_name = '${user_name}',
                email = '${email}',
                phone = '${phone}',
                password = '${password}',
                joining_date = '${joining_date}',
                company_id = '${company_id}',
                department_id = '${department_id}',
                designation_id = '${designation_id}',
                roll_id = '${roll_id}',
                updated_at = '${updated_at}',
                updated_by = '${updated_by}'
            WHERE id = '${employee_id}'
        `);

        for (let permission of module_permission) {
            let {
                module_id,
                create,
                read,
                update,
                write,
                updated_by,
                updated_at
            } = permission;
            const delete_ = permission.delete;
            const export_ = permission.export;
            const import_ = permission.import;

            await connection.query(`
                Update module_permission_master SET
                    create = '${create}',
                    read = '${read}',
                    update = '${update}',
                    write = '${write}',
                    delete = '${delete_}',
                    export = '${export_}',
                    import = '${import_}',
                    updated_by = '${updated_by}',
                    updated_at = '${updated_at}'
                WHERE employee_id = '${employee_id}' && module_id = '${module_id}'
            `);
        }

        return handler.returner([true, ''], 'Employee updated successfully!!', 200);
    } catch (error) {
        console.log("[ERROR] updateEmployeeHandler", error);
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};

// [HANDLE] get all employees data
module.exports.getEmployeeListHandler = async () => {
    //This is no longer in use 
    try {
        const data = await connection.query(
            `SELECT 
                em.id,
                em.first_name, 
                em.last_name,
                dm.name AS designation
                em.employee_id
            FROM employee em
            LEFT JOIN title_master dm ON dm.id = em.designation_id`
        );
        connection.quit();
        return handler.returner([true, data], "Get employee list successfully!!", 200);
    } catch (error) {
        connection.quit();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

// [HANDLE] get employees profile
module.exports.getEmployeeProfileHandler = async (event) => {
    try {

        console.log("ttttttttttttttt")
        const employee_id = event.pathParameters.id;
        const emp = await db.search_one("employee", 'id', employee_id); //this needs to stay 'id' NOT employee_id. The employee id is more or less a fake id for team to use 
        const company_name = await db.select_columns_with_condictions(["name AS company_name"], "company_master", "id", emp[0].company_id);
        const des_name = await db.select_columns_with_condictions(["name AS des_name"], "title_master", "id", emp[0].designation_id);

        const dataa = {
            ...emp[0],
            ...company_name[0],
            ...des_name[0]
        };

        //   const employee_id = event.user_id;

        //   const emp = await db.search_one("employee", 'id', employee_id);
        const emp_id = emp[0].id;
        const experience = await db.search_one("experience", 'employee_id', employee_id);
        const education = await db.search_one("education", 'employee_id', employee_id);
        const family_info = await db.search_one("family_info", 'employee_id', employee_id);
        // console.log("id: ",employee_id)
        const profile = await db.search_one("profile_master", 'employee_id', employee_id);
        // console.log("profile: ",profile)


        const data = { dataa, emp, experience, education, family_info, profile };

        connection.quit();
        return handler.returner([true, data], 'Employee profile data!!', 200);
    } catch (error) {
        connection.quit();
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};



module.exports.updateEmployeeProfileHandler = async (event) => {

    let data = JSON.parse(event.body);
    delete data.auth;



    const { employee_id } = data;
    try {
        await db.update_one('employee', data, 'employee_id', employee_id);
        const result = await db.search_one('employee', 'employee_id', employee_id);
        await connection.end();

        return handler.returner([true, result[0]], 'employee profile updated.', 200);

    } catch (error) {
        connection.quit();
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};

module.exports.deleteEmployeeHandler = async (event) => {
    const employee_id = event.pathParameters.id;
    try {
        await connection.query(`DELETE FROM employee WHERE id = '${employee_id}'`);
        await connection.end();
        return handler.returner([true, ''], 'Employee deleted successfully!!', 200);
    } catch (error) {
        await connection.end();
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};

module.exports.createEmployeeDocumentUrlHandler = async (event) => {
    const reqData = JSON.parse(event.body);
    delete reqData.auth;
    console.log('reqData', reqData);

try {
    const deactive_existing = await db.custom(`
    UPDATE employee_document_urls SET active=0 WHERE id_employee = ${reqData.id_employee} AND id_employee_document_url_name = ${reqData.id_employee_document_url_name}
    `);
}catch{

}

    try {




        reqData.active = 1
        const resData = await db.insert_new(reqData, 'employee_document_urls');
        await connection.end();
        return handler.returner([true, resData], 'employee profile updated.', 200);

    } catch (error) {
        connection.quit();
        return handler.returner([false, error], 'Internal server errors', 500);
    }
};


function disable_url_doc(doc_id) {



}