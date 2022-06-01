const connection = require("../../lib/database/connect");
const handler = require("../handler");

module.exports.getLeaveSettingHandler = async (event) => {
    try {
        const data = await connection.query(`
        SELECT 
            ls.id,
            ls.name,
            ls.days AS ls_days,
            ls.is_on,
            ls.is_active,
            lsd.is_carry_forward,
            lsd.carry_forward_max_days,
            lsd.is_earned_leave
        FROM ((leave_setting ls 
        INNER JOIN employee e ON ls.employee_id = e.id)
        INNER JOIN leave_setting_days lsd ON lsd.leave_settings_id = ls.id);
        `);

        for (let cp of data) {
            const custom = await connection.query(`
                SELECT
                    cp.name,
                    cp.days as CP_days,
                    e.id,
                    e.user_name
                FROM custom_policy cp, custom_policy_employee cpe, employee e 
                WHERE cpe.custom_policy_id = cp.id && cpe.employee_id = e.id && e.id = ${cp.id}
                `);
            cp.policy = custom;
        }
        connection.quit()
        return handler.returner([true, data], 'Succeeded!!', 200);
    } catch (error) {
        connection.quit()
        return handler.returner([false, ''], 'Internal server error.', 500);
    }
}



