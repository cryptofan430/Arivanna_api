import { NextFunction, Request, Response } from "express";

export default async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {id} = req.params;
    // const {user_id} = req;


}
