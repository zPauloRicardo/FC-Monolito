import {Sequelize} from "sequelize-typescript";
import {InvoiceModel} from "./invoice.model";
import {InvoiceProductModel} from "./invoice-product.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([InvoiceModel, InvoiceProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate a invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Cliente 1",
            document: "00000000000",
            address: {
                street: "Rua A",
                number: "1",
                complement: "Ap 2",
                city: "Tangamandapio",
                state: "TT",
                zipCode: "00000000",
            },
            items: [
                {
                    id: "I1",
                    name: "Item 1",
                    price: 30,
                },
                {
                    id: "II2",
                    name: "Item 2",
                    price: 20,
                },
            ],
        });

        const repository = new InvoiceRepository();
        await repository.add(invoice);

        const invoiceDB = await InvoiceModel.findOne({
            where: {id: "1"},
            include: InvoiceProductModel,
        });

        expect(invoiceDB).toBeDefined;
        expect(invoiceDB.toJSON()).toStrictEqual({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => ({
                invoice_id: invoice.id.id,
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        });
    });

    it("should generate a invoice", async () => {
        const invoice = await InvoiceModel.create(
            {
                id: "1",
                name: "Cliente 1",
                document: "00000000000",
                street: "Rua A",
                number: "1",
                complement: "Ap 2",
                city: "Tangamandapio",
                state: "TT",
                zipCode: "00000000",
                items: [
                    {
                        id: "1",
                        name: "Item 1",
                        price: 20,
                    },
                    {
                        id: "2",
                        name: "Item 2",
                        price: 30,
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                include: [InvoiceProductModel],
            }
        );

        const repository = new InvoiceRepository();
        const result = await repository.find(invoice.id);

        expect(result.id.id).toEqual(invoice.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.street);
        expect(result.address.number).toEqual(invoice.number);
        expect(result.address.complement).toEqual(invoice.complement);
        expect(result.address.city).toEqual(invoice.city);
        expect(result.address.state).toEqual(invoice.state);
        expect(result.address.zipCode).toEqual(invoice.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id.id).toEqual("1");
        expect(result.items[0].name).toEqual("Item 1");
        expect(result.items[0].price).toEqual(20);
        expect(result.items[1].id.id).toEqual("2");
        expect(result.items[1].name).toEqual("Item 2");
        expect(result.items[1].price).toEqual(30);
        expect(result.createdAt).toStrictEqual(invoice.createdAt);
    });
});
