var mysql = require("mysql")
const connection = require("../lib/database/connect")
const db = require("../lib/database/query")

exports.returner = async (result, api_name, statusCode) => {
    
    if (statusCode == undefined) {
        statusCode = 200
    }
    if (result[0]) {
        return await {
            statusCode: statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                success: result[0],
                api: api_name,
                data: result[1] || "Server Error, please try again later",
            }),
        }
    } else {
        console.log("ERROR",result)

        //console.log("this is the return: ", JSON.stringify(result[1]))
        return await {
            statusCode: statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                success: result[0],
                api: api_name,
                // data: isJson
                //     ? result[1]
                //     : result[1]?.toString() || "Server Error, please try again later",
            }),
        }
    }
}

function isJson(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

exports.datetime = async () => {
    return new Date().toISOString().slice(0, 19).replace("T", " ")
}

exports.url_to_json = async (url) => {
    var hash
    var myJson = {}
    var hashes = url.slice(url.indexOf("?") + 1).split("&")
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=")
        myJson[hash[0]] = hash[1]
    }
    return myJson
}

async function object_size(object) {
    //this returns the size of a given object
    Object.size = async function (obj) {
        var size = 0,
            key
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++
        }
        return size
    }
    return await Object.size(object)
}

exports.db_insert = async (data, table) => {
    //this builds the insert query // From there it will process the query
    const object_size_var = await object_size(data)
    var columns = "INSERT INTO " + table + " (" + Object.keys(data) + ")"
    var query_value_spots = "VALUES ("
    for (let index = 0; index < object_size_var; index++) {
        const key = Object.keys(data)[index]
        const value = Object.values(data)[index]
        query_value_spots = query_value_spots + "?,"
    }
    query_value_spots = query_value_spots.slice(0, -1) + ")"
    var full_query = columns + query_value_spots
    var table = Object.values(data)
    full_query = mysql.format(full_query, table)
    const result = await query(full_query)
    return result
}

exports.query = async (full_query) => {
    // this processes the query
    return new Promise(function (resolve, reject) {
        connection.query(full_query, function (err, rows) {
            if (err) {
                resolve([false, err])
            } else {
                resolve([true, rows])
            }
        })
    }).then(async () => {
        await connection.end() //close connection
    })
}

exports.get_access_level = async (id) => {
    let access_level = [4, 5]
    switch (id) {
        case 0:
            access_level.push(2, 3)
            break
        case 1:
            access_level.push(1, 2, 3)
            break
        case 2:
            access_level.push(0, 1, 2, 3)
            break
        default:
            null
            break
    }
    return access_level
}

exports.required_field_error = async (e) => {
    let errors
    if (e.name === "utopiaError") {
        errors = e.message
            .split(",")
            .map((field) => {
                return `${field} is required`
            })
            .join(", ")
    }
    return errors
}
