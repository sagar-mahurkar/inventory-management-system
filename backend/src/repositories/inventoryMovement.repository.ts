import { dataSource } from "../database/dataSource";
import { InventoryMovement } from "../entities/InventoryMovement";

export const inventoryMovementRepository = dataSource.getRepository(InventoryMovement);
