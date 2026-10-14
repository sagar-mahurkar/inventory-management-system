import type { Request, Response } from "express";
import { SummaryService } from "../services/summary.service";

export async function getSummary(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await SummaryService.getSummary() });
}

export async function getMovementSummary(
  _req: Request,
  res: Response,
): Promise<void> {
  res.status(200).json({ data: await SummaryService.getMovementSummary() });
}
