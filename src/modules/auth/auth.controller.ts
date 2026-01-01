import type { Request, Response } from "express";
import { env } from "../../env.ts";
import { parseDurationToMs } from "../../utils/time.ts";
import * as authService from "./auth.service.ts";
import type { CreateUser } from "./auth.types.ts";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    maxAge: parseDurationToMs(env.REFRESH_TOKEN_EXPIRY),
};

export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    res.json({
        message: "Login successful",
        user: result.user,
        accessToken: result.accessToken,
    });
}

export async function registerController(
    req: Request<any, any, CreateUser>,
    res: Response
) {
    const result = await authService.register(req.body);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    res.status(201).json({
        message: "Registered successfully",
        user: result.user,
        accessToken: result.accessToken,
    });
}

export async function logoutController(req: Request, res: Response) {
    await authService.logout(req.cookies.refreshToken);

    res.clearCookie("refreshToken", cookieOptions);
    res.sendStatus(204);
}

export async function refreshTokenController(req: Request, res: Response) {
    const result = await authService.refresh(req.cookies.refreshToken);

    res.cookie("refreshToken", result.refreshToken, cookieOptions);
    res.json({ accessToken: result.accessToken });
}