import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/appError.ts";
import { verifyToken } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
    userId?: string;
}

export async function requireAuth(
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new UnauthorizedError();
    }

    const token = header.split(" ")[1];
    if (!token) {
        throw new UnauthorizedError();
    }
    const { payload } = await verifyToken(token);

    req.userId = payload.userId;
    next();
}