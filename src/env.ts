import { configDotenv } from "dotenv";
import { z } from "zod";

configDotenv();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]),
	PORT: z.coerce.number().positive().default(3000),
	DATABASE_URL: z.string().startsWith("postgresql://"),
	JWT_ACCESS_SECRET: z.string(),
	ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
	REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
	SALT_ROUNDS: z.coerce.number().default(10),
});

export const env = envSchema.parse(process.env);
