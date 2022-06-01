## BELOW IS EXAMPLE ON HOW TO STRUTURE A FUNCTION AND USE THE RETURN AND DB QUERY


const handler = require("../../middleware/handler")
const db = require("../../lib/database/query")
const auth_token = require("../../middleware/token_handler")

const api_name = "cart create"
const custom_errors = [
    "body is empty",
    "user does not exist",
    "authentication required",
    "cart create unsuccessful",
]

class CustomError extends Error {
    constructor(message) {
        super(message)
        this.name = "utopiaError"
    }
}

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body)

        if (!body || JSON.stringify(body) === "{}") {
            throw `${custom_errors[0]}`
        }

        const all_fields = Object.keys(body)

        const required_fields = ["token", "id_user", "cart"]

        const missing_fields = required_fields.filter((field) => !all_fields.includes(field))

        if (missing_fields.length > 0) {
            throw new CustomError(missing_fields)
        }

        const { cart, id_user, token } = body

        const user_exist = (await db.search_one("users", "id_user", id_user))[0]

        if (!user_exist) {
            throw `${custom_errors[1]}`
        }

        const isAuthUser = await auth_token.verify(token)

        if (id_user != isAuthUser) {
            throw `${custom_errors[2]}`
        }

        const cart_string = JSON.stringify(cart)

        const cart_exist = (
            await db.select_one("carts", {
                id_user,
            })
        )?.length

        const cart_datetime = await handler.datetime()

        const data = {
            id_user,
            cart_items: cart_string,
        }

        let new_cart

        if (!cart_exist) {
            data.cart_datetime_created = cart_datetime
            new_cart = await db.insert_new(data, "carts")
        }

        if (cart_exist) {
            data.cart_datetime_updated = cart_datetime
            new_cart = await db.update_with_condition("carts", data, { id_user })
        }

        if (!new_cart) {
            throw `${custom_errors[3]}`
        }

        data.cart_items = cart

        return handler.returner([true, data], api_name, 201)
    } catch (e) {
        let errors = await handler.required_field_error(e)
        if (custom_errors.includes(e)) {
            errors = e
        }
        if (errors) {
            return handler.returner([false, errors], api_name, 400)
        }
        return handler.returner([false], api_name, 500)
    }
}
