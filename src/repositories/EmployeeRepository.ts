import {EntityRepository, Repository} from 'typeorm';

import Employee from '../entities/employee';

@EntityRepository(Employee)
class EmployeeRepositories extends Repository<Employee> {}

export default EmployeeRepositories;
