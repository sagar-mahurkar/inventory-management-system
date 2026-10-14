import { Router } from "express";
import { validateBody, validateQuery } from "../middleware/validateRequest";
import {
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from "../validators/product.validator";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", validateQuery(listProductsQuerySchema), listProducts);
router.post("/", validateBody(createProductSchema), createProduct);
router.get("/:id", getProduct);
router.patch("/:id", validateBody(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
