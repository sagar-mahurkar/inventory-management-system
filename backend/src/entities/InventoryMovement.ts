import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "./Product";

export const INVENTORY_MOVEMENT_TYPES = ["STOCK_IN", "STOCK_OUT"] as const;
export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number];

@Entity({ name: "inventory_movements" })
@Check(
  "CHK_inventory_movements_movement_type",
  '"movement_type" IN (\'STOCK_IN\', \'STOCK_OUT\')',
)
@Check("CHK_inventory_movements_quantity_positive", '"quantity" > 0')
@Index("IDX_inventory_movements_product_created_at", ["product_id", "created_at"])
@Index("IDX_inventory_movements_created_at", ["created_at"])
export class InventoryMovement {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "product_id", type: "uuid", nullable: false })
  product_id!: string;

  @ManyToOne(() => Product, (product) => product.inventory_movements, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product!: Product;

  @Column({ type: "varchar", length: 10, nullable: false })
  movement_type!: InventoryMovementType;

  @Column({ type: "integer", nullable: false })
  quantity!: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  note!: string | null;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;
}
