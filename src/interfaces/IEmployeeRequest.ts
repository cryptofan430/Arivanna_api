export default interface IEmployeeRequest {
    employee_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password?: string;
    joining_date: string;
    phone: string;
    company_id: number;
    department_id: number;
    designation_id: number;
    // leave_setting_id: number;
    is_active: boolean;
    roll_id: number;
};