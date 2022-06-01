const { ensurejwtAuthorized } = require("./auth");

const {
    getJobPostsHandler,
    getJobPostHandler,
    addApplicantHandler,
    addJobPostHandler,
    updateJobPostHandler,
    deleteJobPostHandler,
    getApplicantsHandler,
    getJobvacanciesHandler,
    getJobseekerqtyHandler,
    getactiveApplicationqtyHandler,
    getjobdashboardHandler,
    updateApplicantHandler,
    getLatestJobsHandler,
    getrecentapplicationsHandler,
    getrecentjobsHandler,
    getopenJobPostsHandler,
    getapplicationsHandler,
    getapplicationsforuserHandler,
    upload_job_detail_handler,
    getJobPostByIdApplicantsHandler,getsignelforuserHandler
    ,get_required_for_apply_job_post_handler
} = require("./Handlers/JobHandler");

module.exports.getopenJobPosts = async (event) => {
    return await getopenJobPostsHandler(event);
};

module.exports.getapplications = async (event) => {
    // return await getapplicationsHandler(event);
    return await getApplicantsHandler(event);
};

module.exports.getrecentjobs = async (event) => {
    return await getrecentjobsHandler(event);
};

module.exports.getrecentapplications = async (event) => {
    return await getrecentapplicationsHandler(event);
};

module.exports.getjobdashboard = async (event) => {
    return await getjobdashboardHandler(event);
};

module.exports.getactiveApplicationqty = async (event) => {
    return await getactiveApplicationqtyHandler(event);
};


module.exports.getJobvacancies = async (event) => {
    return await getJobvacanciesHandler(event);
};
module.exports.getJobseekerqty = async (event) => {
    return await getJobseekerqtyHandler(event);
};

module.exports.getJobPosts = async (event) => {
    return await getJobPostsHandler(event);
};

module.exports.getLatestJobs = async (event) => {
    return await getLatestJobsHandler(event);
};

module.exports.getJobPost = async (event) => {
    return await getJobPostHandler(event);
};

module.exports.addJobPost = async (event) => {
    return await ensurejwtAuthorized(event, addJobPostHandler);
};

module.exports.updateJobPost = async (event) => {
    return await ensurejwtAuthorized(event, updateJobPostHandler);
};

module.exports.deleteJobPost = async (event) => {
    return await ensurejwtAuthorized(event, deleteJobPostHandler);
};

module.exports.addApplicant = async (event) => {
    return await addApplicantHandler(event);
};

module.exports.getApplicants = async (event) => {
    return await ensurejwtAuthorized(event, getApplicantsHandler);
};

module.exports.updateApplicant = async (event) => {
    return await ensurejwtAuthorized(event, updateApplicantHandler);
};



module.exports.getsignelforuser = async (event) => {

    return await getsignelforuserHandler(event);

    return await ensurejwtAuthorized(event, getsignelforuserHandler);
}


module.exports.getapplicationsforuser = async (event) => {

    return await getapplicationsforuserHandler(event);

    return await ensurejwtAuthorized(event, getrecentapplicationsHandler);
};

module.exports.upload_job_detail = async (event) => {
    return await ensurejwtAuthorized(event, upload_job_detail_handler);
};

module.exports.getJobPostByIdApplicants = async (event) => {
    return await ensurejwtAuthorized(event, getJobPostByIdApplicantsHandler);
};
