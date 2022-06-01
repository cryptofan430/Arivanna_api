const { ensurejwtAuthorized } = require("./auth");
const { getEmployeeIdByApplicantsIdHandler, getApplicationStatusesHandler } = require("./Handlers/ApplicantHandler");

module.exports.getEmployeeIdByApplicantsId = async (event) => {
  // return await getDocumentsByEmployeeIdHandler(event)
  return await ensurejwtAuthorized(event, getEmployeeIdByApplicantsIdHandler);
};

module.exports.getApplicationStatuses = async (event) => {
  return await getApplicationStatusesHandler(event);
};
