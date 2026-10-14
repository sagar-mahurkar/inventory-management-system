
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  FRONTEND_ORIGIN: z
    .url()
    .default("http://localhost:5173"),

  DATABASE_HOST: z.string().optional(),
  DATABASE_PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5432),
  DATABASE_NAME: z.string().optional(),
  DATABASE_USER: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(z.treeifyError(result.error));
  process.exit(1);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
