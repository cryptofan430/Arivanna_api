const jwt = require('jsonwebtoken');

const handle = require('./handler');
const connection = require('../lib/database/connect');
const bcrypt = require("bcryptjs")

const PRIVATE = "4f93ac9d10cb751b8c9c646bc9dbccb9";

const passwordHash = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    return passwordHash
}

module.exports.login = async (event, context) => {
    const { email, password } = JSON.parse(event.body);
    /*
        const user_exist = (await db.search_one("employee", "email", email))[0]
        console.log("user exists: ", user_exist)
        const pass_valid = await bcrypt.compare(password, user_exist.user_password)
        console.log("user exists: ", user_exist)
    */




    try {
        const employee = await connection.query(
            `SELECT * FROM employee WHERE email = '${email}';`
        );
        const validPassword = await bcrypt.compare(password, employee[0].password);
        if (validPassword) {
            const token = jwt.sign({
                email,
            }, PRIVATE, {
                subject: employee[0].employee_id.toString(),
                expiresIn: '1d',
            });

            connection.quit()
            return handle.returner([true, token], 'logged-in', 200);
        } else {
            connection.quit();
            return handle.returner([false, ''], 'Password incorrect', 401);
        }
    } catch (error) {
        console.log(error);
        connection.quit();
        return handle.returner([false, ''], 'Email incorrect', 401);
    }
}

module.exports.ensure_access_Authorized = async (event, next, requried_access_types) => {

}

module.exports.ensurejwtAuthorized = async (event, next) => {
    const body = JSON.parse(event.body)
    var auth
    if (event.headers.Authorization == undefined) {
        console.log("Latest Auth In use")
        auth = JSON.stringify(body.auth);
    }
    else {
        console.log("OUTDATED Auth In use: change this. Need to put the auth in the body. Not the header. As this causes a cors error on the live prod")
        auth = JSON.stringify(event.headers.Authorization);
    }

    if (!auth) {
        return handle.returner([false, ''], 'Custom Unauthorized', 401);
    }

    try {
        const [, t] = auth.split(' ');
        const [token,] = t.split("\"");
        var tok = jwt.verify(token, PRIVATE);
        event.user_id = tok.sub;

        return await next(event);
    } catch (err) {
        return handle.returner([false, ''], 'Unauthorized', 401);
    }
}

module.exports.getuser_id = async (event) => {
    return await this.ensurejwtAuthorized(event, () => {
        return handle.returner([true, event.user_id], 'User Id returned', 200);
    });
}