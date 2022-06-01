const handler = require("../handler");
const db = require('../../lib/database/query');

module.exports.getEmployeeIdByApplicantsIdHandler = async (event) => {
  // get the employee id from the event 
  const id_applicants = event.pathParameters.id;
  console.log(`id_applicants: ${id_applicants}`);

  try {
    const data = await db.select_oneColumn('applicants', 'id_employee', 'id_applicants', id_applicants);
    const { id_employee } = data[0];
    return handler.returner([true, id_employee], 'Get the id_employee of the id_applicants!', 200);
  } catch (error) {
    console.log(error);
    return handler.returner([false, ''], 'Internal server error.', 500);
  }
};

module.exports.getApplicationStatusesHandler = async (event) => {
  try {
    const resData = await db.select_all('applicantion_statuses');
    return handler.returner([true, resData], 'Get all statuses of applications!', 200);
  } catch (error) {
    console.log(error);
    return handler.returner([false, ''], 'Internal server error.', 500);
  }
};