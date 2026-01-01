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
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }

            if (schema.query) {
                Object.assign(req.query, schema.query.parse(req.query));
            }

            if (schema.params) {
                Object.assign(req.params, schema.params.parse(req.params));
            }

            if (schema.headers) {
                Object.assign(req.headers, schema.headers.parse(req.headers));
            }

            next();
        };