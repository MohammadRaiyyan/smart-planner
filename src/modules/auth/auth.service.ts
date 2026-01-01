import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "../../db/client.ts";
import { sessions, users } from "../../db/schema.ts";
import { env } from "../../env.ts";
import {
    BadRequestError,
    UnauthorizedError
} from "../../utils/appError.ts";
import { generateToken } from "../../utils/jwt.ts";
import { comparePassword, hashPassword } from "../../utils/password.ts";
import { parseDurationToMs } from "../../utils/time.ts";

const REFRESH_TOKEN_TTL = parseDurationToMs(env.REFRESH_TOKEN_EXPIRY);

export async function login(email: string, password: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const isValid = await comparePassword(user.passwordHash, password);
    if (!isValid) {
        throw new UnauthorizedError("Invalid credentials");
    }

    return issueTokens(user.id, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    });
}

export async function register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    const passwordHash = await hashPassword(input.password);

    const [user] = await db
        .insert(users)
        .values({ ...input, passwordHash })
        .returning({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
        });

    if (!user) {
        throw new BadRequestError("Unable to create user");
    }

    return issueTokens(user.id, user);
}

export async function logout(refreshToken?: string) {
    if (!refreshToken) return;

    await db
        .update(sessions)
        .set({ revoked: true })
        .where(eq(sessions.refreshToken, refreshToken));
}

export async function refresh(refreshToken?: string) {
    if (!refreshToken) {
        throw new UnauthorizedError();
    }

    const session = await db.query.sessions.findFirst({
        where: eq(sessions.refreshToken, refreshToken),
    });

    if (!session || session.revoked || session.expiresAt < new Date()) {
        throw new UnauthorizedError();
    }

    const newRefreshToken = crypto.randomUUID();

    await db
        .update(sessions)
        .set({
            refreshToken: newRefreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        })
        .where(eq(sessions.id, session.id));

    const accessToken = await generateToken({
        userId: session.userId,
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
}

/* ---------------- HELPERS ---------------- */

async function issueTokens(
    userId: string,
    userPayload: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }
) {
    const accessToken = await generateToken({ userId });
    const refreshToken = crypto.randomUUID();

    await db.insert(sessions).values({
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    return {
        accessToken,
        refreshToken,
        user: userPayload,
    };
}