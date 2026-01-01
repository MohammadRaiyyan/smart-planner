import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.ts";

export function errorMiddleware(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.issues,
        });
    }

    // Known application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    // Unknown errors (log & mask)
    console.error("Unhandled error:", err);

    return res.status(500).json({
        message: "Internal server error",
    });
}