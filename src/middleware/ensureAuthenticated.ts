import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export default (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).send({
        "message": "Unauthorized."
    }).end();

    const [, token] = auth.split(' ');

    try {
        const {sub} = verify(
            token,
            "4f93ac9d10cb751b8c9c646bc9dbccb9"
        ) as IPayload;

        req.user_id = sub;
        console.log(sub);

        return next();

    } catch(err) {
        return res.status(401).send({
            "message": "Unauthorized."
        }).end();
    }
};
