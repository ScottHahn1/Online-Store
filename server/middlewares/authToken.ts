import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface CustomJwtPayload {
  userId: number;
  username?: string;
}

export interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required. Please provide a valid token.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' })
        }

        req.user = decoded as CustomJwtPayload; 
        next();
    })
}

export default authenticateToken;