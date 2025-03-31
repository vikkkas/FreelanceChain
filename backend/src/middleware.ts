import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import ts from "typescript";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const WORKER_JWT_SECRET = process.env.WORKER_JWT_SECRET;
export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader = req.get("authorization") ?? "";

    // @ts-ignore 
    try{const decoded = jwt.verify(authHeader, JWT_SECRET);
                // @ts-ignore

        if(decoded.userId){
                    // @ts-ignore

            req.userId = decoded.userId;
            return next();
        }else{
            return res.status(403).json({
                message:"You are not logged in"
            })
        }
    }catch(err){
        return res.status(403).json({
            message:"You are not logged in"
        })
    }
}

export function workerMiddleware(req: Request, res: Response, next: NextFunction) { 
    const authHeader = req.headers["authorization"] ?? "";


    try {
    // @ts-ignore 
        const decoded = jwt.verify(authHeader, WORKER_JWT_SECRET);
        // @ts-ignore
        if (decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}