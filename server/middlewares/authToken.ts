import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: {
        userId: number;
        username: string;
    }
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required. Please provide a valid token.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invaild token.' })
        }

        if (user) {
            req.user = user; 
            next();
        }
    })
}

export default authenticateToken;