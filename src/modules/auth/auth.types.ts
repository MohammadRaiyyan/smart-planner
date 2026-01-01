import type z from "zod";
import { registerSchema } from "./auth.schema.ts";

export type JwtPayload = {
    userId: string;
};

export type CreateUser = z.infer<typeof registerSchema>