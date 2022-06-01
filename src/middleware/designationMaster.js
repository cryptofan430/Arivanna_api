const handler = require("../middleware/handler");
const connection = require("../lib/database/connect");

module.exports.getDesignationMasterData = async (event) => {
    const department_id = event.pathParameters.department_id;
    console.log({ department_id });

    const data = await connection.query(
        `SELECT id, name as designation_name,department_id
        FROM title_master where department_id = ${department_id}`
    );
    //console.log("ggggggggggggggggg",data)

    connection.quit();
    return handler.returner([true, data], 'Get company master data successfully!!', 200);
};

module.exports.getAllTitles = async (event) => {
    //   let { department_id } = JSON.parse(event.body)

    const data = await connection.query(
        `SELECT id, name as designation_name,department_id
        FROM title_master`
    );

    connection.quit();
    return handler.returner([true, data], 'Get company master data successfully!!', 200);
};

