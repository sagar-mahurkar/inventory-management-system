import { Router } from "express";
import { validateBody, validateQuery } from "../middleware/validateRequest";
import {
  createInventoryMovementSchema,
  listInventoryMovementsQuerySchema,
} from "../validators/inventoryMovement.validator";
import {
  createInventoryMovement,
  listInventoryMovements,
} from "../controllers/inventoryMovement.controller";

const router = Router();

router.get("/", validateQuery(listInventoryMovementsQuerySchema), listInventoryMovements);
router.post("/", validateBody(createInventoryMovementSchema), createInventoryMovement);

export default router;
