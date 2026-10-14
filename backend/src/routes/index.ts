import { Router } from "express";
import categoryRouter from "./category.routes";
import productRouter from "./product.routes";
import inventoryMovementRouter from "./inventoryMovement.routes";

export const apiRouter = Router();

apiRouter.use("/categories", categoryRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/inventory-movements", inventoryMovementRouter);
