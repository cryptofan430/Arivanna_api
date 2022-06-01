import { getCustomRepository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { classToPlain } from 'class-transformer';

// Repositories
import EmployeeRepositories from '../repositories/EmployeeRepository';
import CompanyMasterRepositories from '../repositories/CompanyMasterRepository';
import DepartmentMasterRepositories from '../repositories/DepartmentMasterRepository';
import DesignationMasterRepositories from '../repositories/DesignationMasterRepository';
import LeaveSettingRepositories from '../repositories/LeaveSettingReposity';
import RoleMasterRepositories from '../repositories/RoleMasterRepository';

// Interface
import IEmployeeRequest from '../interfaces/IEmployeeRequest';
import IAuthenticateRequest from '../interfaces/IAuth';

class EmployeeService {
    async execute({
        employee_id,
        first_name,
        last_name,
        user_name,
        email,
        password,
        joining_date,
        phone,
        company_id,
        department_id,
        designation_id,
        // leave_setting_id,
        is_active,
        roll_id
    }: IEmployeeRequest) {
        const employeeRepo = getCustomRepository(EmployeeRepositories);
        const companyRepo = getCustomRepository(CompanyMasterRepositories);
        const departmentRepo = getCustomRepository(DepartmentMasterRepositories);
        const designationRepo = getCustomRepository(DesignationMasterRepositories);
        const leaveSettingRepo = getCustomRepository(LeaveSettingRepositories);
        const rollRepo = getCustomRepository(RoleMasterRepositories);

        const companyExists = await companyRepo.findOne(company_id);
        const depExists = await departmentRepo.findOne(department_id);
        const desExists = await designationRepo.findOne(designation_id);
        // const leaveExists = await leaveSettingRepo.findOne(leave_setting_id);
        const roleExists = await rollRepo.findOne(roll_id);

        if ( !companyExists ) throw new Error("Company/id does not exists");
        if ( !depExists ) throw new Error("Department/id does not exists");
        if ( !desExists ) throw new Error("Designation/id does not exists");
        // if ( !leaveExists ) throw new Error("Leave/id does not exists");
        if ( !roleExists ) throw new Error("Role/id does not exists");

        if (!email || !password) {
            throw new Error('Incorrect email/password wrong.');
        }

        const employeeAlreadyExists = await employeeRepo.findOne({
            email
        });

        if (employeeAlreadyExists) {
            throw new Error('email is in user try new one.');
        }

        const passwordHash = await hash(password, 8);

        const employee = employeeRepo.create({ 
            employee_id,
            first_name,
            last_name,
            user_name,
            email,
            password: passwordHash,
            joining_date,
            phone,
            company_id,
            department_id,
            designation_id,
            // leave_setting_id,
            is_active,
            roll_id
        });
        // employee.employee_id      = employee_id;
        // employee.first_name       = first_name; 
        // employee.last_name        = last_name; 
        // employee.user_name        = user_name; 
        // employee.email            = email; 
        // employee.password         = passwordHash;
        // employee.joining_date     = joining_date;
        // employee.phone            = phone;
        // employee.company_id       = company_id;
        // employee.department_id    = department_id;
        // employee.designation_id    = designation_id;
        // employee.leave_setting_id = leave_setting_id,
        // employee.is_active        = is_active,
        // employee.roll_id          = roll_id;

        await employeeRepo.save(employee);

        return employee;
    }

    async getAllEmployee() {
        return classToPlain(await getCustomRepository(EmployeeRepositories).find());
    }

    async authUser({email, password}: IAuthenticateRequest) {
        const empRepo = getCustomRepository(EmployeeRepositories);

        const emp = await empRepo.findOne({ email, });
        if (!emp) throw new Error('Email/Password incorrect.');

        const passwordMatch = await compare(password, emp.password);
        if (!passwordMatch || !emp) throw new Error('Email/Password incorrect.');

        const token = sign({
            email: emp.email,
        }, "4f93ac9d10cb751b8c9c646bc9dbccb9", {
            subject: emp.id.toString(),
            expiresIn: '1d',
        });

        return token;
    }
}

export default EmployeeService;
