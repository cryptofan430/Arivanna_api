const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()
const db = require("../lib/database/query")

module.exports = {
    create: (id) => {
        const token = jwt.sign({ _id_user: id }, "dev_key") // process.env.JWT_KEY);
        return token
    },

    verify: async (token) => {
        const isAuth = (await db.search_one("user_tokens", "token", token))[0]
        return isAuth ? isAuth.id_user : null
    },
}
