import { SignJWT, jwtVerify, type JWTVerifyResult } from "jose";
import { createSecretKey } from "node:crypto";
import { env } from "../env.ts";
import type { JwtPayload } from "../modules/auth/auth.types.ts";

export async function generateToken(payload: JwtPayload): Promise<string> {
    const secretKey = createSecretKey(env.JWT_ACCESS_SECRET, "utf-8");

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(env.ACCESS_TOKEN_EXPIRY)
        .sign(secretKey);
}

export async function verifyToken(token: string): Promise<JWTVerifyResult<JwtPayload>> {
    const secretKey = createSecretKey(env.JWT_ACCESS_SECRET, "utf-8");

    return await jwtVerify(token, secretKey);
}
