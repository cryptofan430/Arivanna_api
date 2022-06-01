const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");
module.exports.getModuleMasterData = async (event) => {
   
    const data = await connection.query(
        `SELECT id, name as module_name,
        type, url
        FROM module_master where is_active = 1`
    );
    connection.quit()

    return handler.returner([true, data], 'Get module master data successfully!!', 200)
}