import { z } from 'zod';

const serverEnvSchema = z.object({
	APP_ENV: z.enum(['development', 'production']).default('development'),
	DATABASE_URL: z.string(),
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_NAME: z.string(),
	DATABASE_HOST: z.string(),
	DATABASE_PORT: z.coerce.number().default(3306),
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),
});

const clientEnvSchema = z.object({
	NEXT_PUBLIC_APP_URL: z.string(),
});

const clientEnv = clientEnvSchema.safeParse({
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!clientEnv.success) {
	console.error('Client environment variable validation failed:', clientEnv.error.format());
	throw new Error('Invalid client environment variables');
}

let serverEnv;

if (typeof window === 'undefined') {
	serverEnv = serverEnvSchema.safeParse(process.env);

	if (!serverEnv.success) {
		console.error('Server environment variable validation failed:', serverEnv.error.format());
		throw new Error('Invalid server environment variables');
	}
}

const parsedEnv = {
	...clientEnv.data,
	...serverEnv?.data,
} as z.infer<typeof serverEnvSchema> & z.infer<typeof clientEnvSchema>;

export const env = parsedEnv;