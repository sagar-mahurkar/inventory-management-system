import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "./Category";
import { InventoryMovement } from "./InventoryMovement";

@Entity({ name: "products" })
@Check("CHK_products_unit_price_non_negative", '"unit_price" >= 0')
@Check("CHK_products_current_stock_non_negative", '"current_stock" >= 0')
@Check("CHK_products_reorder_level_non_negative", '"reorder_level" >= 0')
@Index("UQ_products_sku", ["sku"], { unique: true })
@Index("IDX_products_category_id", ["category_id"])
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "category_id", type: "uuid", nullable: false })
  category_id!: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category!: Category;

  @Column({ type: "varchar", length: 64, nullable: false })
  sku!: string;

  @Column({ type: "varchar", length: 160, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  // PostgreSQL NUMERIC values are represented as strings by node-postgres.
  @Column({ type: "numeric", precision: 12, scale: 2, nullable: false })
  unit_price!: string;

  @Column({ type: "integer", default: 0, nullable: false })
  current_stock!: number;

  @Column({ type: "integer", name: "reorder_level", default: 0, nullable: false })
  reorder_level!: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @OneToMany(() => InventoryMovement, (movement) => movement.product)
  inventory_movements!: InventoryMovement[];
}
