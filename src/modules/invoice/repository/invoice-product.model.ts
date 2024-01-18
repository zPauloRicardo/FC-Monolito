import {BelongsTo, Column, Model, PrimaryKey, Table,} from "sequelize-typescript";
import {InvoiceModel} from "./invoice.model";

@Table({
    tableName: "invoice_items",
    timestamps: false,
})
export class InvoiceProductModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: false})
    declare price: number;

    @BelongsTo(() => InvoiceModel, {foreignKey: "invoice_id"})
    declare invoice: InvoiceModel;
}
