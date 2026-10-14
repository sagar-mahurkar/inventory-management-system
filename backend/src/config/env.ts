import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    FRONTEND_ORIGIN: z.url().default("http://localhost:5173"),

    DATABASE_HOST: z.string().trim().min(1).optional(),
    DATABASE_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
    DATABASE_NAME: z.string().trim().min(1).optional(),
    DATABASE_USER: z.string().trim().min(1).optional(),
    DATABASE_PASSWORD: z.string().min(1).optional(),
    DATABASE_ADMIN_DB: z.string().trim().min(1).default("postgres"),
  })
  .superRefine((value, ctx) => {
    // HTTP-only tests do not need a real database connection.
    if (value.NODE_ENV === "test") {
      return;
    }

    const requiredDatabaseVariables = [
      "DATABASE_HOST",
      "DATABASE_NAME",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
    ] as const;

    for (const key of requiredDatabaseVariables) {
      if (!value[key]) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `${key} is required outside the test environment.`,
        });
      }
    }
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(z.treeifyError(result.error));
  process.exit(1);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;

export function getDatabaseConfig() {
  const { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = env;

  if (!DATABASE_HOST || !DATABASE_NAME || !DATABASE_USER || !DATABASE_PASSWORD) {
    throw new Error(
      "Database configuration is incomplete. Set DATABASE_HOST, DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD.",
    );
  }

  return {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
  };
}
