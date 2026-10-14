import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { apiRouter } from "./routes";
import { AppError } from "./middleware/AppError";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1", apiRouter);

app.use((_req, _res, next) => {
  next(new AppError("Resource not found.", 404, "NOT_FOUND"));
});

app.use(errorMiddleware);

export default app;
