import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ClientModel from "./client.model";
import ProductModel from "./product.model";

@Table({
  tableName: "orders",
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @HasMany(() => ProductModel)
  declare products: ProductModel[];

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
