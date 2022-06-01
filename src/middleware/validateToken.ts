import { getCustomRepository } from 'typeorm';
import { NextFunction, Request, Response } from "express";

import EmployeeRepository from '../repositories/EmployeeRepository';
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string
}

export default async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {token} = req.params;
    const {user_id} = req;

    if(!token) return res.status(401).end();

    const emp = await getCustomRepository(EmployeeRepository).findOne(user_id);

    if (!emp) return res.status(401).end();

    try {
        const {sub} = verify(token, emp.password) as IPayload;

        req.user_id = sub;
        return next();
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid token',
          })
    }
};
