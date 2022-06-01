import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import IAuthenticateRequest from "../interfaces/IAuth";
import EmployeeRepositories from '../repositories/EmployeeRepository';
import EmployeeService from '../services/EmployeeService';


export default class UserAuth {
    // async handle({email, password}: IAuthenticateRequest) {
    //     const empRepo = getCustomRepository(EmployeeRepositories);

    //     const emp = await empRepo.findOne({
    //         email
    //     });

    //     if (!emp) 
    // }

    async handle(req: Request, res: Response) {
        const {email, password} = req.body;
        const empService = new EmployeeService();
        
        return res.json(await empService.authUser({ email, password }))
    }
}
