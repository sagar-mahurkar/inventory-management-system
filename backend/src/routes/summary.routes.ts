import { Router } from "express";
import {
  getMovementSummary,
  getSummary,
} from "../controllers/summary.controller";

const router = Router();

router.get("/", getSummary);
router.get("/movements", getMovementSummary);

export default router;
