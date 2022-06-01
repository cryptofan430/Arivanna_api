import { Response, Request } from 'express';
import EmployeeService from '../services/EmployeeService';

class EmployeeController {
    async getAllEmployees(req: Request, res: Response) {
        const employees = new EmployeeService();
        
        return res.json(await employees.getAllEmployee());
    }

    async create(req: Request, res: Response) {
        const emp = new EmployeeService();

        return res.json(await emp.execute(req.body)); 
    }
};

export default EmployeeController;
