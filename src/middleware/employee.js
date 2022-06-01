// Queries Handlers
const handler = require("../middleware/handler");

const db = require("../lib/database/query");
const connection = require("../lib/database/connect");
const bcrypt = require("bcryptjs")

// Auth
const { ensurejwtAuthorized } = require("./auth");

// API Handlers
const {
    getEmployeePermissionHandler,
    updateEmployeeHandler,
    getSingleEmployeeHandler,
    getEmployeeHandler,
    getEmployeeListHandler,
    deleteEmployeeHandler,
    getEmployeeProfileHandler,
    getEmployeeqtyHandler,
    updateEmployeeProfileHandler,
    createEmployeeDocumentUrlHandler
} = require("./Handlers/EmployeeHandler");

const passwordHash = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    return passwordHash
}

// [GET] employee permission with auth token
module.exports.getEmployeeqty = async (event) => {
    return await getEmployeeqtyHandler(event);

    //return await ensurejwtAuthorized(event, getEmployeeqtyHandler);
};

// [GET] employee permission with auth token
module.exports.getEmployeeProfile = async (event) => {
    return await getEmployeeProfileHandler(event);
    // return await ensurejwtAuthorized(event, getEmployeeProfileHandler); TODO: This needs to be reimplemented
};

module.exports.updateEmployeeProfile = async (event) => {
    return await updateEmployeeProfileHandler(event);
};


// [GET] employee permission with auth token
module.exports.getEmployeePermission = async (event) => {
    return await ensurejwtAuthorized(event, getEmployeePermissionHandler);
};

// [GET] single employee with auth token
module.exports.getEmployee = async (event) => {
    return await ensurejwtAuthorized(event, getEmployeeHandler);
};

module.exports.getSingleEmployee = async (event) => {
    return await ensurejwtAuthorized(event, getSingleEmployeeHandler);
};

module.exports.updateEmployee = async (event) => {
    return await ensurejwtAuthorized(event, updateEmployeeHandler);
};

module.exports.deleteEmployee = async (event) => {
    return await ensurejwtAuthorized(event, deleteEmployeeHandler);
};

module.exports.createEmployeeNew = async (event) => {
    let reqBody = JSON.parse(event.body);


   // reqBody.password = await passwordHash(reqBody.password)

    try {
        const rowid = await connection.query('SELECT * FROM employee em');

        let empBody = {};
        empBody.id = await rowid.length + 1;
        empBody.first_name = reqBody.first_name;
        empBody.employee_id = await rowid.length + 1;
        empBody.last_name = reqBody.last_name;
        empBody.user_name = reqBody.user_name;
        empBody.email = reqBody.email;
        const salt = await bcrypt.genSalt(10);
        empBody.password = await bcrypt.hash(reqBody.password, salt);
        empBody.joining_date = reqBody.joining_date;
        empBody.phone = reqBody.phone;
        empBody.company_id = reqBody.company_id;
        empBody.department_id = reqBody.department_id;
        empBody.designation_id = reqBody.designation_id;
        empBody.is_active = true;
        empBody.roll_id = reqBody.roll_id;
        empBody.created_at = reqBody.created_at;
        empBody.created_by = reqBody.created_by;
        empBody.updated_at = reqBody.updated_at;

        empBody.updated_by = reqBody.updated_by;
        const data = await db.insert_new(empBody, "employee");

        const keysOfModulePermission = Object.keys(reqBody.module_permission);

        for (let i = 0; i < keysOfModulePermission.length; i += 1) {
            let permissonObject = {};

            permissonObject.module_id = reqBody.module_permission[keysOfModulePermission[i]].module_id;
            permissonObject.employee_id = await rowid.length + 1;
            permissonObject.create = reqBody.module_permission[keysOfModulePermission[i]].create;
            permissonObject.read = reqBody.module_permission[keysOfModulePermission[i]].read;
            permissonObject.write = reqBody.module_permission[keysOfModulePermission[i]].write;
            permissonObject.delete = reqBody.module_permission[keysOfModulePermission[i]].delete;
            permissonObject.import = reqBody.module_permission[keysOfModulePermission[i]].import;
            permissonObject.export = reqBody.module_permission[keysOfModulePermission[i]].export;
            permissonObject.is_active = reqBody.module_permission[keysOfModulePermission[i]].is_active;
            permissonObject.created_by = reqBody.module_permission[keysOfModulePermission[i]].created_by;
            permissonObject.updated_by = reqBody.module_permission[keysOfModulePermission[i]].updated_by;
            permissonObject.created_at = reqBody.module_permission[keysOfModulePermission[i]].created_at;
            permissonObject.updated_at = reqBody.module_permission[keysOfModulePermission[i]].updated_at;

            await db.insert_new(permissonObject, "module_permission_master");
        }

        const team_member_id = rowid.length + 1;

        var body = {
            passport_number: reqBody.profile?.passport_number,
            passport_exp: reqBody.profile?.passport_exp,
            nationality: reqBody.profile?.nationality,
            religion: reqBody.profile?.religion,
            marital_status: reqBody.profile?.marital_status,
            employment_of_spouse: reqBody.profile?.employment_of_spouse,
            number_children: reqBody.profile?.number_children,
            bank_name: reqBody.profile?.bank_name,
            bank_acc_number: reqBody.profile?.bank_acc_number,
            bank_routing_number: reqBody.profile?.bank_routing_number,
            em_prim_name: reqBody.profile?.em_prim_name,
            em_prim_relationship: reqBody.profile?.em_prim_relationship,
            em_prim_phone: reqBody.profile?.em_prim_phone,
            em_sec_name: reqBody.profile?.em_sec_name,
            em_sec_relationship: reqBody.profile?.em_sec_relationship,
            em_sec_phone: reqBody.profile?.em_sec_phone,
            employee_id: team_member_id
        };

        await db.insert_new(body, "profile_master");


        var body = {
            name: reqBody.family_info?.name,
            relationship: reqBody.family_info?.relationship,
            DOB: reqBody.family_info?.DOB,
            phone: reqBody.family_info?.phone,
            employee_id: team_member_id
        };
        await db.insert_new(body, "family_info");

        var body = {
            name_of_providor: reqBody.experience?.name_of_providor,
            position: reqBody.experience?.position,
            start: reqBody.experience?.start,
            end: reqBody.experience?.end,
            address: reqBody.experience?.address,
            employee_id: team_member_id
        };
        await db.insert_new(body, "experience");

        var body = {
            name_of_providor: reqBody.education?.name_of_providor,
            course: reqBody.education?.course,
            start: reqBody.education?.start,
            end: reqBody.education?.end,
            address: reqBody.education?.address,
            employee_id: team_member_id
        };
        await db.insert_new(body, "education");
        connection.quit();
        return handler.returner([true, data], 'Employee created successfully!!', 200);
    } catch (error) {
        connection.quit();

        console.log("error", error);
        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.createEmployeeMaverick = async (event) => {
    try {
        let reqBody = JSON.parse(event.body);
        console.log(reqBody);
        const { first_name, last_name, user_name, email, password, joining_date, phone, company_id, department_id, designation_id, roll_id, created_at, updated_at, created_by, module_permissions, profile, family_info, experience, education } = reqBody;
        const rowid = await connection.query('SELECT * FROM employee em');
        const employee_id = rowid.length + 1;

        /* ------------ Insert a new employee ----------- */
        let empBody = {};
        empBody.id = employee_id;
        empBody.first_name = first_name;
        empBody.employee_id = employee_id;
        empBody.last_name = last_name;
        empBody.user_name = user_name;
        empBody.email = email;
        empBody.password = password;
        empBody.joining_date = joining_date;
        empBody.phone = phone;
        empBody.company_id = company_id;
        empBody.department_id = department_id;
        empBody.designation_id = designation_id;
        empBody.is_active = true;
        empBody.roll_id = roll_id;
        empBody.created_at = created_at;
        empBody.created_by = created_by;
        empBody.updated_at = updated_at;
        empBody.updated_by = created_by;
        const data = await db.insert_new(empBody, "employee");
        /* ------------------------------------------------ */


        /* ------- Insert the new module permissions ------ */
        for (let i = 0; i < module_permissions.length; i += 1) {
            if (module_permissions[i].read || module_permissions[i].write || module_permissions[i].create || module_permissions[i].delete || module_permissions[i].import || module_permissions[i].export) {
            
                await db.insert_new({
                    module_id: module_permissions[i].module_id,
                    employee_id,
                    read: module_permissions[i].read,
                    write: module_permissions[i].write,
                    create: module_permissions[i].create,
                    delete: module_permissions[i].delete,
                    import: module_permissions[i].import,
                    export: module_permissions[i].export,
                    is_active: module_permissions[i].is_active
                }, 'module_permission_master');
            }

        }
        /* ------------------------------------------------ */

        if (profile) {
            const { passport_number, passport_exp, nationality, religion, marital_status, employment_of_spouse, number_children, bank_name, bank_acc_number, bank_routing_number, em_prim_name, em_prim_relationship, em_prim_phone, em_sec_name, em_sec_relationship, em_sec_phone } = profile;

            await db.insert_new({ passport_number, passport_exp, nationality, religion, marital_status, employment_of_spouse, number_children, bank_name, bank_acc_number, bank_routing_number, em_prim_name, em_prim_relationship, em_prim_phone, em_sec_name, em_sec_relationship, em_sec_phone, employee_id }, "profile_master");
        }

        if (family_info) {
            const { name, relationship, DOB, phone } = family_info;
            await db.insert_new({ name, relationship, DOB, phone, employee_id }, "family_info");
        }

        if (experience) {
            const { name_of_providor, position, start, end, address } = experience;
            await db.insert_new({ name_of_providor, position, start, end, address, employee_id }, "experience");
        }

        if (education) {
            const { name_of_providor, course, start, end, address } = education;
            await db.insert_new({ name_of_providor, course, start, end, address, employee_id }, "education");
        }
        connection.quit();
        return handler.returner([true, data], 'Employee created successfully!!', 200);
    } catch (error) {
        connection.quit();

        console.log("error", error);
        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.getEmployeeList = async () => {
    try {
        const data = await connection.query(
            `select em.img_url, em.id, em.first_name, em.last_name, em.user_name,
            dm.name AS designation,em.employee_id
            FROM employee em
            LEFT JOIN title_master dm ON dm.id = em.designation_id`
        );
        await connection.end();

        return handler.returner([true, data], 'Employee get successfully!!', 200);
    }
    catch (error) {
        connection.quit();

        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.getEmployeeListMaverick = async () => {
    try {
        const data = [];
        const employees = await db.custom(
            'SELECT ' +
            'employee.*, ' +
            'company_master.name AS company_name, ' +
            'department_master.name AS department_name, ' +
            'title_master.name AS designation_name, ' +
            'module_permission_master.module_id, ' +
            'module_master.name AS module_name, ' +
            'module_master.type AS module_type, ' +
            'module_permission_master.id AS module_permission_id, ' +
            'module_permission_master.read, ' +
            'module_permission_master.write, ' +
            'module_permission_master.create, ' +
            'module_permission_master.delete, ' +
            'module_permission_master.import, ' +
            'module_permission_master.export ' +
            'FROM employee ' +
            'LEFT JOIN company_master ON employee.company_id = company_master.id ' +
            'LEFT JOIN department_master ON employee.department_id = department_master.id ' +
            'LEFT JOIN title_master ON employee.designation_id = title_master.id ' +
            'LEFT JOIN module_permission_master ON employee.employee_id = module_permission_master.employee_id ' +
            'LEFT JOIN module_master ON module_permission_master.module_id = module_master.id'
        );

        for (let i = 0; i < employees.length; i += 1) {
            let { id, module_id, module_name, module_type, module_permission_id } = employees[i];
            let existedEmployee = data.find(employee => employee.id == id);

            if (existedEmployee) {
                if (module_permission_id) {
                    existedEmployee.module_permissions.push({
                        module_id,
                        module_name,
                        module_type,
                        module_permission_id,
                        read: employees[i].read,
                        write: employees[i].write,
                        create: employees[i].create,
                        delete: employees[i].delete,
                        import: employees[i].import,
                        export: employees[i].export
                    });
                }
            } else {
                let changedEmployee = { ...employees[i], module_permissions: [] };
                delete changedEmployee.module_id;
                delete changedEmployee.module_name;
                delete changedEmployee.module_type;
                delete changedEmployee.module_permission_id;
                delete changedEmployee.read;
                delete changedEmployee.write;
                delete changedEmployee.create;
                delete changedEmployee.delete;
                delete changedEmployee.import;
                delete changedEmployee.export;
                if (module_permission_id) {
                    changedEmployee.module_permissions.push({
                        module_id,
                        module_name,
                        module_type,
                        module_permission_id,
                        read: employees[i].read,
                        write: employees[i].write,
                        create: employees[i].create,
                        delete: employees[i].delete,
                        import: employees[i].import,
                        export: employees[i].export
                    });
                }
                data.push(changedEmployee);
            }
        }
        return handler.returner([true, data], 'Employee get successfully!!', 200);
    }
    catch (error) {
        console.log(error);

        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.createEmployee = async (event) => {
    try {
        let reqBody = JSON.parse(event.body);
        let empBody = {};
        empBody.first_name = reqBody.first_name;
        empBody.employee_id = reqBody.employee_id;
        empBody.last_name = reqBody.last_name;
        empBody.user_name = reqBody.user_name;
        empBody.email = reqBody.email;
        empBody.password = reqBody.password;
        empBody.joining_date = reqBody.joining_date;
        empBody.phone = reqBody.phone;
        empBody.company_id = reqBody.company_id;
        empBody.department_id = reqBody.department_id;
        empBody.designation_id = reqBody.designation_id;
        empBody.is_active = true;
        empBody.roll_id = 1;
        empBody.created_by = 1;
        empBody.updated_by = 1;
        const data = await db.insert_new(empBody, "employee");
        for (let permission of reqBody.module_permission) {
            let permissonObject = {};
            permissonObject.module_id = permission.module_id;
            permissonObject.employee_id = data.insertId;
            permissonObject.read = permission.read;
            permissonObject.update = permission.update;
            permissonObject.delete = permission.delete;
            permissonObject.import = permission.import;
            permissonObject.export = permission.export;
            permissonObject.is_active = true;
            permissonObject.created_by = 1;
            permissonObject.updated_by = 1;
            await db.insert_new(permissonObject, "module_permission_master");
        }
        connection.quit();

        return handler.returner([true, data], 'Employee created successfully!!', 200);
    } catch (error) {
        connection.quit();

        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.getEmployeeEditData = async (event) => {
    let {
        employee_id
    } = event.pathParameters;

    const data = await connection.query(`select 
    cm.name as company_name,
    dm.name as department_name,
    desMast.name as designation,
    em.* from employee em
    LEFT JOIN company_master cm on cm.id = em.company_id
    LEFT JOIN department_master dm ON dm.id  =  em.department_id
    LEFT JOIN title_master desMast on desMast.id = em.designation_id
    where em.id = ${id}
    `);
    const permisson =
        await connection.query(`select mm.name,mm.type,mpm.* from module_permission_master mpm 
    LEFT JOIN module_master mm ON mm.id = mpm.module_id
    where mpm.employee_id = ${employee_id}`);
    if (data && data.length > 0) data[0].module_permission = permisson;
    connection.quit();

    return handler.returner([true, data[0]], "Get edit employee details", 200);
};

module.exports.deleteEmployeeData = async (event) => {
    let { id } = event.pathParameters;
    try {
        let data = await connection.query(`update employee set is_active = false where id = ${id}`);
        connection.quit();

        return handler.returner([true, data], 'Employee deleted successfully!!', 200);
    } catch (error) {
        connection.quit();

        return handler.returner([false, error], 'Something went wrong', 500);

    }
};

module.exports.getAllEmployeePermission = async (event) => {
    try {
        //console.log("ggggggggggggggggggggggggggggggggggggggggggggggaaaaa")
        const data = await connection.query(`select * from module_master`);
        //console.log("ffff",data)

        connection.quit();

        return handler.returner([true, data], 'Get all permissions', 200);
    }
    catch (error) {
        console.log("error: ", error);
        connection.quit();

        return handler.returner([false, error], 'Get all permissions', 500);
    }
};

module.exports.updateEmployee = async (event) => {
    let reqBody = JSON.parse(event.body);
    let { id } = event.pathParameters;
    console.log(reqBody);
    try {
        let empBody = {};
        empBody.first_name = reqBody.first_name;
        empBody.last_name = reqBody.last_name;
        empBody.user_name = reqBody.user_name;
        empBody.email = reqBody.email;
        empBody.password = reqBody.password;
        empBody.joining_date = reqBody.joining_date;
        empBody.phone = reqBody.phone;
        empBody.company_id = reqBody.company_id;
        empBody.department_id = reqBody.department_id;
        empBody.designation_id = reqBody.designation_id;
        empBody.is_active = true;
        empBody.roll_id = reqBody.roll_id;
        empBody.created_at = reqBody.created_at;
        empBody.created_by = reqBody.created_by;
        empBody.updated_at = reqBody.updated_at;
        empBody.updated_by = reqBody.updated_by;

        const data = await db.update_one("employee", empBody, 'employee_id', id);

        // const keysOfModulePermission = Object.keys(reqBody.module_permission);

        // for (let i = 0; i < keysOfModulePermission.length; i += 1) {
        //     let permissonObject = {};

        //     permissonObject.module_id = reqBody.module_permission[keysOfModulePermission[i]].module_id;
        //     permissonObject.employee_id = id;
        //     permissonObject.create = reqBody.module_permission[keysOfModulePermission[i]].create;
        //     permissonObject.read = reqBody.module_permission[keysOfModulePermission[i]].read;
        //     permissonObject.write = reqBody.module_permission[keysOfModulePermission[i]].write;
        //     permissonObject.delete = reqBody.module_permission[keysOfModulePermission[i]].delete;
        //     permissonObject.import = reqBody.module_permission[keysOfModulePermission[i]].import;
        //     permissonObject.export = reqBody.module_permission[keysOfModulePermission[i]].export;
        //     permissonObject.is_active = reqBody.module_permission[keysOfModulePermission[i]].is_active;
        //     permissonObject.created_by = reqBody.module_permission[keysOfModulePermission[i]].created_by;
        //     permissonObject.updated_by = reqBody.module_permission[keysOfModulePermission[i]].updated_by;
        //     permissonObject.created_at = reqBody.module_permission[keysOfModulePermission[i]].created_at;
        //     permissonObject.updated_at = reqBody.module_permission[keysOfModulePermission[i]].updated_at;

        //     await db.insert_new(permissonObject, "module_permission_master");
        // }

        // const team_member_id = id;

        // var body = {
        //     passport_number: reqBody.profile?.passport_number,
        //     passport_exp: reqBody.profile?.passport_exp,
        //     nationality: reqBody.profile?.nationality,
        //     religion: reqBody.profile?.religion,
        //     marital_status: reqBody.profile?.marital_status,
        //     employment_of_spouse: reqBody.profile?.employment_of_spouse,
        //     number_children: reqBody.profile?.number_children,
        //     bank_name: reqBody.profile?.bank_name,
        //     bank_acc_number: reqBody.profile?.bank_acc_number,
        //     bank_routing_number: reqBody.profile?.bank_routing_number,
        //     em_prim_name: reqBody.profile?.em_prim_name,
        //     em_prim_relationship: reqBody.profile?.em_prim_relationship,
        //     em_prim_phone: reqBody.profile?.em_prim_phone,
        //     em_sec_name: reqBody.profile?.em_sec_name,
        //     em_sec_relationship: reqBody.profile?.em_sec_relationship,
        //     em_sec_phone: reqBody.profile?.em_sec_phone,
        //     employee_id: team_member_id
        // };

        // await db.insert_new(body, "profile_master");


        // var body = {
        //     name: reqBody.family_info?.name,
        //     relationship: reqBody.family_info?.relationship,
        //     DOB: reqBody.family_info?.DOB,
        //     phone: reqBody.family_info?.phone,
        //     employee_id: team_member_id
        // };
        // await db.insert_new(body, "family_info");

        // var body = {
        //     name_of_providor: reqBody.experience?.name_of_providor,
        //     position: reqBody.experience?.position,
        //     start: reqBody.experience?.start,
        //     end: reqBody.experience?.end,
        //     address: reqBody.experience?.address,
        //     employee_id: team_member_id
        // };
        // await db.insert_new(body, "experience");

        // var body = {
        //     name_of_providor: reqBody.education?.name_of_providor,
        //     course: reqBody.education?.course,
        //     start: reqBody.education?.start,
        //     end: reqBody.education?.end,
        //     address: reqBody.education?.address,
        //     employee_id: team_member_id
        // };
        // await db.insert_new(body, "education");
        // connection.quit();
        await connection.end();
        return handler.returner([true, data], 'Employee created successfully!!', 200);
    } catch (error) {
        connection.quit();

        console.log("error", error);
        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.updateEmployeeMaverick = async (event) => {
    try {
        let reqBody = JSON.parse(event.body);
        let { id } = event.pathParameters;
        console.log(reqBody);
        console.log(id);
        const { first_name, last_name, user_name, email, password, joining_date, phone, company_id, department_id, designation_id, roll_id, updated_at, updated_by, employee_id, module_permissions } = reqBody;

        /* ------------ Update the employee ----------- */
        let empBody = {};
        empBody.first_name = first_name;
        empBody.last_name = last_name;
        empBody.user_name = user_name;
        empBody.email = email;
        empBody.password = password;
        empBody.joining_date = joining_date;
        empBody.phone = phone;
        empBody.company_id = company_id;
        empBody.department_id = department_id;
        empBody.designation_id = designation_id;
        empBody.is_active = true;
        empBody.roll_id = roll_id;
        empBody.updated_at = updated_at;
        empBody.updated_by = updated_by;

        const data = await db.update_one("employee", empBody, 'employee_id', employee_id);
        /* ------------------------------------------------ */


        /* ------- Update the module permissions of the employee ------ */
        for (let i = 0; i < module_permissions.length; i += 1) {
            if (module_permissions[i].read || module_permissions[i].write || module_permissions[i].create || module_permissions[i].delete || module_permissions[i].import || module_permissions[i].export) {
                await db.update_one(
                    'module_permission_master',
                    {
                        read: module_permissions[i].read,
                        write: module_permissions[i].write,
                        create: module_permissions[i].create,
                        delete: module_permissions[i].delete,
                        import: module_permissions[i].import,
                        export: module_permissions[i].export,
                    },
                    'id',
                    module_permissions[i].module_permission_id
                );
            } else {
                await db.delete_one('module_permission_master', 'id', module_permissions[i].module_permission_id);
            }
        }
        /* ---------------------------------------------------------- */
        await connection.end();
        return handler.returner([true, data], 'Employee created successfully!!', 200);
    } catch (error) {
        connection.quit();

        console.log("error", error);
        return handler.returner([false, error], 'Something went wrong', 500);
    }
};

module.exports.createEmployeeDocumentUrl = async (event) => {
 // return await  createEmployeeDocumentUrlHandler(event)
    return await ensurejwtAuthorized(event, createEmployeeDocumentUrlHandler);
};
