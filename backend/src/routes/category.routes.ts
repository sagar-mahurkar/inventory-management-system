import { Router } from "express";
import { validateBody } from "../middleware/validateRequest";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "../controllers/category.controller";

const router = Router();

router.get("/", listCategories);
router.post("/", validateBody(createCategorySchema), createCategory);
router.get("/:id", getCategory);
router.patch("/:id", validateBody(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
