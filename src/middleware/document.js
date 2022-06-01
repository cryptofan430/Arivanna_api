const { ensurejwtAuthorized } = require("./auth");
const {
  getDocumentsByEmployeeIdHandler,
  getSpecificCompanyProvidedDocumentsByEmployeeIdHandler,
  changeApprovedByEmployeeDocumentUrlIdHandler
} = require("./Handlers/DocumentHandler");

module.exports.getDocumentsByEmployeeId = async (event) => {
  // return await getDocumentsByEmployeeIdHandler(event)
  return await ensurejwtAuthorized(event, getDocumentsByEmployeeIdHandler);
};

module.exports.getSpecificCompanyProvidedDocumentsByEmployeeId = async (event) => {
   return await getSpecificCompanyProvidedDocumentsByEmployeeIdHandler(event)
  return await ensurejwtAuthorized(event, getSpecificCompanyProvidedDocumentsByEmployeeIdHandler);
};

module.exports.changeApprovedByEmployeeDocumentUrlId = async (event) => {
  return await ensurejwtAuthorized(event, changeApprovedByEmployeeDocumentUrlIdHandler);
};