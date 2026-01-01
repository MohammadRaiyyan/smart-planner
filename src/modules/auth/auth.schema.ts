import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("A valid email is required"),
    password: z.string("Password is required").min(8, "Password must be of 8 characters"),
    firstName: z.string("First name is required").min(1, "First name is required"),
    lastName: z.string("Last name is required").min(1, "Last name is required")
});

export const loginSchema = z.object({
    email: z.email("A valid email is required"),
    password: z.string("Password is required").min(8, "Password must be of 8 characters"),
});

export const refreshSchema = z.object({
    refreshToken: z.string(),
});

export const forgotPasswordSchema = z.object({
    email: z.email("A valid email is required"),
});

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string("Password is required").min(8, "Password must be of 8 characters"),
});