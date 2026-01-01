import bcrypt from "bcrypt";
import { env } from "../env.ts";

export async function comparePassword(hashedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, env.SALT_ROUNDS)
}