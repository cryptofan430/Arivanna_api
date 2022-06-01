const connection = require('../../lib/database/connect');
const db = require('../../lib/database/query');
const handler = require("../handler");
const employeehandler = require("./EmployeeHandler");

module.exports.getrecentjobsHandler = async (event) => {
    try {
        const data = await db.custom("SELECT * FROM job_posts where status = 'open' ORDER BY id_job_posts DESC LIMIT 5");

        await connection.end();
        return handler.returner([true, data], 'Get recent applications successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getapplicationsHandler = async (event) => {
    try {
        const data = await db.custom("SELECT * FROM applicants JOIN job_posts ON job_posts.id_job_posts=applicants.id_job_posts");

/*
        const data = await db.custom(
            `
            SELECT * FROM applicants 

JOIN job_posts ON job_posts.id_job_posts=applicants.id_job_posts
JOIN employee_document_urls ON employee_document_urls.id_employee = applicants.id_employee
            
            `
        );*/


        await connection.end();
        return handler.returner([true, data], 'Get applications successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};


module.exports.getrecentapplicationsHandler = async (event) => {
    try {
        const data = await db.custom("SELECT * FROM applicants JOIN job_posts ON job_posts.id_job_posts=applicants.id_job_posts where status = 'open' ORDER BY applied_at DESC LIMIT 5");

        await connection.end();
        return handler.returner([true, data], 'Get recent applications successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};


module.exports.getjobdashboardHandler = async (event) => {
    try {
        const data = {
            vaccancies: await this.getJobvacanciesHandler(null, true),
            active_applications: await this.getactiveApplicationqtyHandler(null, true),
            job_seekers: await this.getJobseekerqtyHandler(null, true),
            team_members: await employeehandler.getEmployeeqtyHandler(null, true)
        };

        await connection.end();
        return handler.returner([true, data], 'Get job vacancies successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getactiveApplicationqtyHandler = async (event, basic) => {
    try {
        const applications = await db.select_all_from_join_custom_joint('applicants', 'applicantion_statuses',
            'applicantion_statuses.id_applicantion_statuses = applicants.id_applicantion_status');

        const reducer = (previousValue, currentValue) => previousValue + currentValue;
        var application_qty = applications.map(async (item, index) => {
            if (item.status_name != "Onboarded" & item.status_name != "Rejected") {
                await connection.end();
                return 1;
            } else {
                await connection.end();
                return 0;
            }
        });

        if (basic) {
            await connection.end();
            return application_qty.reduce(reducer);
        } else {
            await connection.end();
            return handler.returner([true, {
                application_qty: application_qty.reduce(reducer)
            }], 'Get active application qty successfully', 200);

        }
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};


module.exports.getJobvacanciesHandler = async (event, basic) => {
    try {
        const jobPost = await db.select_all('job_posts');
        const reducer = (previousValue, currentValue) => previousValue + currentValue;
        var vacancies = await jobPost.map((item, index) => {
            if (item.status == "Open") {
                return item.vaccancy;
            } else {
                return 0;
            }
        });

        if (basic) {
            await connection.end();
            return vacancies.reduce(reducer);
        } else {
            await connection.end();
            return handler.returner([true, {
                vacancies: vacancies.reduce(reducer)
            }], 'Get job vacancies successfully', 200);
        }
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getJobseekerqtyHandler = async (event, basic) => {
    try {
        const users = await db.select_all_from_join_custom_joint('employee', 'title_master', 'employee.designation_id = title_master.id');
        const reducer = (previousValue, currentValue) => previousValue + currentValue;
        var job_seekers = await users.map((item, index) => {
            if (item.name == 'Job Seeker') {
                return 1;
            } else {
                return 0;
            }
        });

        if (basic) {
            return job_seekers.reduce(reducer);
        } else {
            await connection.end();
            return handler.returner([true, {
                job_seekers: job_seekers.reduce(reducer)
            }], 'Get job seeker qty successfully', 200);
        }
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getopenJobPostsHandler = async (event, basic) => {
    try {
        let jobPost = await connection.query(
            " SELECT job.* from job_posts as job left join applicants as app on job.id_job_posts = app.id_job_posts left join applicantion_statuses as app_status on app_status.id_applicantion_statuses = app.id_applicantion_status and app_status.status_name = 'onboarded' where status = 'open' group by job.id_job_posts");
        let jobapplications = await db.custom(`
        SELECT job_posts.id_job_posts
        FROM applicants
        INNER JOIN job_posts ON job_posts.id_job_posts = applicants.id_job_posts;
        `);
        const unique = [...new Set(jobapplications.map(item => item.id_job_posts))]; // [ 'A', 'B']
        var unique_object = unique.map((item, index) => {
            return {
                [item]: 0
            };
        });
        unique_object = Object.assign({}, ...unique_object);
        const applications_applied = jobapplications.map((item_app, index) => {
            unique_object[item_app.id_job_posts] = unique_object[item_app.id_job_posts] + 1;
        });
        const final = await jobPost.map((item_jobPost, index) => {
            var temp = {};
            temp = item_jobPost;
            temp.qty_applications = unique_object[item_jobPost.id_job_posts] > 0 ? unique_object[item_jobPost.id_job_posts] : 0;
            return temp;
        });
        await connection.end();
        return handler.returner([true, final], 'Jobs data successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getJobPostsHandler = async (event, basic) => {
    try {
        // let jobPost =  db.custom()
        /*   let jobPost = await connection.query(
               "SELECT job.*, (job.vaccancy - (count(app_status.status_name))) vaccancy_count from job_posts as job " +
               "left join applicants as app on job.id_job_posts = app.id_job_posts " +
               "left join applicantion_statuses as app_status on app_status.id_applicantion_statuses = app.id_applicantion_status and app_status.status_name = 'onboarded'" +
               "group by job.id_job_posts "
   
           )*/
        /* SELECT job_posts.id_job_posts
         FROM applicants
         INNER JOIN job_posts ON job_posts.id_job_posts=applicants.id_job_posts;
        */

        // TODO(Umar) make it generic and efficient
        let jobPost = await connection.query(
            `SELECT 
                job.* 
            from job_posts as job 
            left join applicants as app on job.id_job_posts = app.id_job_posts 
            left join applicantion_statuses as app_status 
            on app_status.id_applicantion_statuses = app.id_applicantion_status 
            and app_status.status_name = 'onboarded' group by job.id_job_posts`);
        let jobapplications = await db.custom(`
            SELECT job_posts.id_job_posts
            FROM applicants
            INNER JOIN job_posts ON job_posts.id_job_posts = applicants.id_job_posts;
        `);

        const unique = [...new Set(jobapplications.map(item => item.id_job_posts))]; // [ 'A', 'B']
        var unique_object = unique.map((item, index) => {
            return {
                [item]: 0
            };
        });
        unique_object = Object.assign({}, ...unique_object);
        const applications_applied = jobapplications.map((item_app, index) => {
            unique_object[item_app.id_job_posts] = unique_object[item_app.id_job_posts] + 1;
        });
        const final = await jobPost.map((item_jobPost, index) => {
            var temp = {};
            temp = item_jobPost;
            temp.qty_applications = unique_object[item_jobPost.id_job_posts] > 0 ? unique_object[item_jobPost.id_job_posts] : 0;
            return temp;
        });
        await connection.end();
        return handler.returner([true, final], 'Jobs data successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getLatestJobsHandler = async (event, basic) => {
    try {
        const latestJobs = await db.select_all_with_condition_order_and_limit('job_posts', 'start_date', {
            'status': 'Open'
        }, '5', 'DESC');
        await connection.end();
        return handler.returner([true, latestJobs], 'Get Latest Jobs successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getJobPostHandler = async (event) => {
    const id = event.pathParameters.id;
    try {
        let jobPost = await connection.query(
            `SELECT 
                job.* 
            from job_posts as job 
            left join applicants as app on job.id_job_posts = app.id_job_posts 
            left join applicantion_statuses as app_status 
            on app_status.id_applicantion_statuses = app.id_applicantion_status 
            and app_status.status_name = 'onboarded' where job.id_job_posts = '${id}' group by job.id_job_posts`);
        let jobapplications = await db.custom(`
            SELECT job_posts.id_job_posts
            FROM applicants
            INNER JOIN job_posts ON job_posts.id_job_posts = applicants.id_job_posts;
        `);

        const unique = [...new Set(jobapplications.map(item => item.id_job_posts))]; // [ 'A', 'B']
        var unique_object = unique.map((item, index) => {
            return {
                [item]: 0
            };
        });
        unique_object = Object.assign({}, ...unique_object);
        const applications_applied = jobapplications.map((item_app, index) => {
            unique_object[item_app.id_job_posts] = unique_object[item_app.id_job_posts] + 1;
        });
        const final = await jobPost.map((item_jobPost, index) => {
            var temp = {};
            temp = item_jobPost;
            temp.qty_applications = unique_object[item_jobPost.id_job_posts] > 0 ? unique_object[item_jobPost.id_job_posts] : 0;
            return temp;
        });
        await connection.end();
        return handler.returner([true, final[0]], 'Job data successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.addJobPostHandler = async (event) => {
    var data = JSON.parse(event.body);
    delete data.auth;
    delete data.applications;

    try {
        const jobPost = await db.insert_new(data, 'job_posts');

        const jobPostId = jobPost.insertId;
        const jobPostData = await db.search_one('job_posts', 'id_job_posts', jobPostId);

        await connection.end();
        return handler.returner([true, jobPostData[0]], 'Job post added.', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.updateJobPostHandler = async (event) => {
    var data = JSON.parse(event.body);
    delete data.auth;
    delete data.applications;

    try {
        await db.update_one('job_posts', data, 'id_job_posts', event.pathParameters.id);

        const jobPostData = await db.search_one('job_posts', 'id_job_posts', event.pathParameters.id);

        await connection.end();
        // const jobPostData = await db.search_one('job_posts', 'id_job_posts', event.pathParameters.id);

        return handler.returner([true, jobPostData[0]], 'Job put updated.', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.deleteJobPostHandler = async (event) => {
    try {
        await db.delete_one('job_posts', 'id_job_posts', event.pathParameters.id);
        await connection.end();
        return handler.returner([true, ''], 'Job post deleted.', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.addApplicantHandler = async (event) => {
    const job_id = event.pathParameters.id;
    const data = JSON.parse(event.body);

    try {
        const existing = await connection.query(
            `SELECT * FROM applicants WHERE id_job_posts = ${job_id} AND id_employee = ${data.id_employee}`
        );
        if(existing){
            await connection.end();
            return handler.returner([false, ''], 'Already Applied.', 500);
        }
        const applicant = await connection.query(
            `INSERT INTO applicants (applied_at, id_applicantion_status, id_job_posts, id_employee) 
                VALUES ( '${data.applied_at}', '1', '${job_id}', ${data.id_employee})`
        );

        // get the updated data from 'applicants'
        const applicantData = await db.search_one('applicants', 'id_applicants', applicant.insertId);
        await connection.end();
        return handler.returner([true, applicantData[0]], 'Applicant added.', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getApplicantsHandler = async (event) => {
    try {
        var applicants = await connection.query(
            `select app.*,employee.first_name,employee.last_name, job.title, app_status.status_name ,employee_document_urls.url
            from applicants app 
                left join job_posts job on job.id_job_posts=app.id_job_posts 
                left join applicantion_statuses app_status on app_status.id_applicantion_statuses=app.id_applicantion_status
                left join employee on employee.id = app.id_employee
JOIN employee_document_urls ON employee_document_urls.id_employee = app.id_employee`
        );

        applicants.map((item) => {

            item.name = item.first_name + " " + item.last_name;
            delete item.first_name;
            delete item.last_name;

        });

        await connection.end();
        return handler.returner([true, applicants], 'Applicants data successfully', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.updateApplicantHandler = async (event) => {
    var data = JSON.parse(event.body);
    delete data.auth;
    console.log(data)
    try {
        await db.update_one('applicants', data, 'id_applicants', event.pathParameters.id);

        // const applicantData = await db.search_one('applicants', 'id_applicants', event.pathParameters.id);
        const applicantData = await connection.query(
            "select app.*,job.title_id, job.title, app_status.status_name " +
            "from applicants app " +
            "left join job_posts job on job.id_job_posts=app.id_job_posts " +
            "left join applicantion_statuses app_status on app_status.id_applicantion_statuses=app.id_applicantion_status " +
            `where app.id_applicants=${event.pathParameters.id}`
        );


        if (data.id_applicantion_status == 7) {//Onboarded
            await onboarded_title_change(data.id_employee, applicantData[0].title_id)
            await onboarded_perm_add(data.id_employee, event.user_id, applicantData[0].title_id)
        }



        await connection.end();
        return handler.returner([true, applicantData[0]], 'Applicant put updated', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};


async function onboarded_perm_add(applicant_id, employee_id, title_id) {
    const reqBody = {
        module_permission: await db.select_all_with_condition("default_permissions", { title_id: title_id })
    }

    const keysOfModulePermission = Object.keys(reqBody.module_permission);
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    for (let i = 0; i < keysOfModulePermission.length; i += 1) {
        let permissonObject = {};

        permissonObject.module_id = reqBody.module_permission[keysOfModulePermission[i]].module_id;
        permissonObject.employee_id = applicant_id;
        permissonObject.create = reqBody.module_permission[keysOfModulePermission[i]].create;
        permissonObject.read = reqBody.module_permission[keysOfModulePermission[i]].read;
        permissonObject.write = reqBody.module_permission[keysOfModulePermission[i]].write;
        permissonObject.delete = reqBody.module_permission[keysOfModulePermission[i]].delete;
        permissonObject.import = reqBody.module_permission[keysOfModulePermission[i]].import;
        permissonObject.export = reqBody.module_permission[keysOfModulePermission[i]].export;
        permissonObject.is_active = 1;
        permissonObject.created_by = employee_id
        permissonObject.updated_by = employee_id
        permissonObject.created_at = datetime
        permissonObject.updated_at = datetime

        await db.insert_new(permissonObject, "module_permission_master");
    }



}

async function onboarded_title_change(applicant_id, title_id) {


    await connection.query(
        `UPDATE employee
        SET designation_id = ${title_id}
        WHERE employee_id = ${applicant_id};`
    );
    await connection.end();

}







module.exports.getsignelforuserHandler = async (event) => {
    try {
        /*   const applications = await connection.query(
               `
               SELECT * FROM hr_prod.applicants where id_employee =   
               ${event.pathParameters.id}`
           );*/

        const data = await connection.query(
            `
            SELECT applicants.*, company_master.name as company,
            department_master.name as department,
            title_master.name as title_,
            job_posts.*,
            applicantion_statuses.status_name
            FROM applicants
                INNER JOIN applicantion_statuses ON applicants.id_applicantion_status = applicantion_statuses.id_applicantion_statuses 
                INNER JOIN job_posts ON applicants.id_job_posts = job_posts.id_job_posts 
            INNER JOIN company_master ON job_posts.comp_id = company_master.id 
            INNER JOIN department_master ON job_posts.dep_id = department_master.id 
            INNER JOIN title_master ON job_posts.title_id = title_master.id 
                
                where id_applicants = 
            ${event.pathParameters.id}`
        );

        await connection.end();
        return handler.returner([true, data], 'Get application details', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getapplicationsforuserHandler = async (event) => {
    try {
        /*   const applications = await connection.query(
               `
               SELECT * FROM hr_prod.applicants where id_employee =   
               ${event.pathParameters.id}`
           );*/

        const applications = await connection.query(
            `
            SELECT applicants.*, company_master.name as company,
            department_master.name as department,
            title_master.name as title_,
            job_posts.*,
            applicantion_statuses.status_name
            FROM applicants
                INNER JOIN applicantion_statuses ON applicants.id_applicantion_status = applicantion_statuses.id_applicantion_statuses 
                INNER JOIN job_posts ON applicants.id_job_posts = job_posts.id_job_posts 
            INNER JOIN company_master ON job_posts.comp_id = company_master.id 
            INNER JOIN department_master ON job_posts.dep_id = department_master.id 
            INNER JOIN title_master ON job_posts.title_id = title_master.id 
                
                where id_employee = 
            ${event.pathParameters.id}`
        );
        const offered_jobs = await applications.filter(o1 =>
            o1.id_applicantion_status != 1 &
            o1.id_applicantion_status != 8 &
            o1.id_applicantion_status != 9 &
            o1.id_applicantion_status != 10 &
            o1.id_applicantion_status != 11
        );


        company_provided_docs = await db.custom(`
        
        SELECT url FROM hr_prod.employee_document_urls
 JOIN employee_document_url_names ON employee_document_url_names.id_employee_document_url_name = employee_document_urls.id_employee_document_url_name

 where employee_document_url_names.active = 1 AND employee_document_urls.active = 1 AND employee_document_url_names.company_provided=1 AND employee_document_urls.id_employee = 

        `  + event.pathParameters.id);

        company_provided_docs = company_provided_docs.map(a => a.url);

        const data = {
            application_all_qty: applications.length,
            offered_jobs_qty: offered_jobs.length,
            applications: applications,
            offered_jobs: offered_jobs,
            company_provided_docs: company_provided_docs
        };

        await connection.end();
        return handler.returner([true, data], 'Applicant put updated', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.upload_job_detail_handler = async (event) => {
    // parsing the body and deleting the auth
    const data = JSON.parse(event.body).data;
    delete data.auth;

    try {
        await connection.query(`
            INSERT INTO employee_document_urls (id_employee_document_url_name, 
                url, 
                active, 
                id_employee, 
                approved, 
                company_provided
                )
                VALUES (
                    '${data.id_employee_document_url_name}',
                    '${data.url}', '${1}', 
                    '${data.id_employee}', '${0}', '${data.company_provided}');
        `);

        await connection.end();
        return handler.returner([true, ''], 'Job put updated.', 200);
    } catch (error) {
        console.log(error);
        await connection.end();
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};

module.exports.getJobPostByIdApplicantsHandler = async (event) => {
    const id_applicants = event.pathParameters.id;
    try {
        const resData = (await db.select_all_from_join2_with_condition_order(
            'applicants',
            'job_posts',
            'id_job_posts', {
            id_applicants
        }
        ))[0];

        return handler.returner([true, resData], 'Job put updated.', 200);
    } catch (error) {
        console.log(error);
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
};