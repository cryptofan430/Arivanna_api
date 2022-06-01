
const handler = require("../../middleware/handler");
const db = require('../../lib/database/query');
const connection = require("../../lib/database/connect");

const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ')

const tm_id = 1//DEV ONLY  TODO: //Change to the jwt varify for the tm id
const created_by = 1
const created_at = datetime
const updated_by = 1
const update_at = datetime



/// training module
module.exports.create_module = async (event) => {
    let {
        name,
        video_url,
        modular_training_category_id,
        position
    } = JSON.parse(event.body)
}

module.exports.update_module = async (event) => {

}

module.exports.delete_module = async (event) => {

}

module.exports.get_module = async (event) => {

}


//////////////////QUESTION
module.exports.create_question = async (event) => {

}

module.exports.update_question = async (event) => {

}

module.exports.delete_question = async (event) => {

}

module.exports.get_question = async (event) => {

}

//////////////////Answers
module.exports.create_answers = async (event) => {

}

module.exports.update_answers = async (event) => {

}

module.exports.delete_answers = async (event) => {

}

module.exports.get_answers = async (event) => {

}

//////////////////Module categories
module.exports.create_category = async (event) => {
    let {
        category_name,
        cat_parent_id,
        position

    } = JSON.parse(event.body)

    try {
        const data = await db.insert_new({ category_name, cat_parent_id, position }, "modular_training_categories")
        connection.quit()
        return handler.returner([true, data], 'Create training module category - Successful', 200)
    } catch (error) {
        connection.quit()
        console.log("error", error)
        return handler.returner([false, error], 'Create training module category - Unsuccessful', 500)
    }

}

module.exports.update_category = async (event) => {
    let {
        id,
        category_name,
        cat_parent_id,
        position

    } = JSON.parse(event.body)

    try {
        var query
        if (cat_parent_id) {
            query = `
            update modular_training_categories set 
            category_name = '${category_name}',
            cat_parent_id = '${cat_parent_id}',
            position = ${position} 
             where id = ${id}
            `
        }
        else {
            query = `
             update modular_training_categories set 
             category_name = '${category_name}',
              position = ${position} 
              where id = ${id}
                `}

        const data = await connection.query(
            query
        );

        connection.quit()
        return handler.returner([true, data], 'Update training module category - Successful', 200)
    } catch (error) {
        connection.quit()
        console.log("error", error)
        return handler.returner([false, error], 'Update training module category - Unsuccessful', 500)
    }
}

module.exports.delete_category = async (event) => {
    let {
        id
    } = JSON.parse(event.body)
    try {
        await db.delete_one("modular_training_categories", "id", id)
        connection.quit()
        return handler.returner([true, data], 'Delete training module category - Successful', 200)
    } catch (error) {//FK caused failure
        try {
            const data = await connection.query(
                `
                update modular_training_categories set 
                status = 0
                 where id = ${id}
                `
            );
            connection.quit()
            return handler.returner([true, data], 'Delete training module category - Successful', 200)
        }
        catch (error) {//actual error 
            connection.quit()
            console.log("error", error)
            return handler.returner([false, error], 'Delete training module category - Unsuccessful', 500)

        }
    }
}

module.exports.get_category = async (event) => {

    let {
        id
    } = JSON.parse(event.body)


    try {
        var data
        if (id) {
            data = await connection.query(
                `
                select * from modular_training_categories  
                 where id = ${id} 
                 AND 
                 status = 1
                `
            );
        }
        else {
            data = await connection.query(
                `
                select * from modular_training_categories  
                 where status = 1
                `
            );

        }






        connection.quit()
        return handler.returner([true, data], 'Get training module category - Successful', 200)
    } catch (error) {
        connection.quit()
        console.log("error", error)
        return handler.returner([false, error], 'Get training module category - Unsuccessful', 500)
    }




}

//////////////////required cateogry
module.exports.create_required_category = async (event) => {

}

module.exports.update_required_category = async (event) => {

}

module.exports.delete_required_category = async (event) => {

}

module.exports.get_required_category = async (event) => {

}
//////////////////required modules
module.exports.create_required_modules_category = async (event) => {

}

module.exports.update_required_modules_category = async (event) => {

}

module.exports.delete_required_modules_category = async (event) => {

}

module.exports.get_required_modules_category = async (event) => {

}