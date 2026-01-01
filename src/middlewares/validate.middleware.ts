import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type Schema = {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
    headers?: ZodType;
};

export const validate =
    (schema: Schema) =>
        (req: Request, _res: Response, next: NextFunction) => {
            if (schema.body) req.body = schema.body.parse(req.body) as Request["body"];
            if (schema.query) req.query = schema.query.parse(req.query) as Request["query"];
            if (schema.params) req.params = schema.params.parse(req.params) as Request["params"];
            if (schema.headers) req.headers = schema.headers.parse(req.headers) as Request["headers"];
            next();
        };