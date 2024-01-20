import {Column, HasMany, Model, PrimaryKey, Table,} from "sequelize-typescript";
import {InvoiceProductModel} from "./invoice-product.model";

@Table({
    tableName: "invoices",
    timestamps: false,
})
export class InvoiceModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: true})
    declare document: string;

    @Column({allowNull: true})
    declare street: string;

    @Column({allowNull: true})
    declare number: string;

    @Column({allowNull: true})
    declare complement: string;

    @Column({allowNull: true})
    declare city: string;

    @Column({allowNull: true})
    declare state: string;

    @Column({allowNull: true})
    declare zipCode: string;

    @HasMany(() => InvoiceProductModel)
    declare items: InvoiceProductModel[];

    @Column({allowNull: false})
    declare createdAt: Date;

    @Column({allowNull: false})
    declare updatedAt: Date;
}
