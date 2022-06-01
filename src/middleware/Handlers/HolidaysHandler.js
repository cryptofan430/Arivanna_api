const handler = require("../handler");
const db = require('../../lib/database/query');

module.exports.getHolidaysHandler = async (event) => {
    try {
        const data = await db.select_many("holidays", ["id", "name", "date", "is_active"]);
        return handler.returner([true, data], 'Holidays data successfully!!', 200);
    } catch (error) {
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

module.exports.createHolidayHandler = async (event) => {
    const created_by = event.user_id;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var holiday = {
        ...JSON.parse(event.body),
        created_by,
        created_at
    };

    try {
        await db.insert_new(holiday, "holidays");
        return handler.returner([true], 'Inserted successfully!!', 204);
    } catch (error) {
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

module.exports.updateHolidayHandler =  async (event) => {
    const updated_by = event.user_id;
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const id = event.pathParameters.id;

    if (!id) {
        return handler.returner([false, 'id is required'], 'Bad request.', 400);
    }

    var holiday = {
        ...JSON.parse(event.body),
        updated_at,
        updated_by
    };

    try {
        await db.update_one(
            "holidays",
            holiday,
            "id",
            id
        );
        return handler.returner([true], 'Updated successfully!!', 204);
    } catch (error) {
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}

module.exports.deleteHolidayHandler = async (event) => {
    const id = event.pathParameters.id;

    try {
        await db.delete_one("holidays", "id", id);
        return handler.returner([true], 'Deleted successfully!!', 204);
    } catch (error) {
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}
