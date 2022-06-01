const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");

module.exports.getCompanyMasterData = async (event) => {
    const data = await connection.query(
        `SELECT id, name as company_name
        FROM company_master`
    );
    await connection.end();
    return handler.returner([true, data], 'Get company master data successfully!!', 200)
}