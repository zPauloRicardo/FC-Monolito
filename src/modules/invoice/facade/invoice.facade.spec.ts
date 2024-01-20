import {Sequelize} from "sequelize-typescript";
import {InvoiceModel} from "../repository/invoice.model";
import {InvoiceProductModel} from "../repository/invoice-product.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Test Invoice Facade", () => {
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
        const invoice = {
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
                    id: "I1",
                    name: "Item 1",
                    price: 50,
                },
                {
                    id: "II2",
                    name: "Item 2",
                    price: 40,
                },
            ],
        };
        const facade = InvoiceFacadeFactory.create();
        await facade.generate(invoice);

        const result = await InvoiceModel.findOne({
            where: {id: "1"},
            include: InvoiceProductModel,
        });

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.street).toEqual(invoice.street);
        expect(result.number).toEqual(invoice.number);
        expect(result.complement).toEqual(invoice.complement);
        expect(result.city).toEqual(invoice.city);
        expect(result.state).toEqual(invoice.state);
        expect(result.zipCode).toEqual(invoice.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(invoice.items[0].id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toEqual(invoice.items[1].id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
    });

    it("should find a invoice", async () => {
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
                        id: "I1",
                        name: "Item 1",
                        price: 50,
                    },
                    {
                        id: "II2",
                        name: "Item 2",
                        price: 40,
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                include: [InvoiceProductModel],
            }
        );

        const facade = InvoiceFacadeFactory.create();
        const result = await facade.find({id: "1"});

        expect(result.id).toBeDefined();
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.street);
        expect(result.address.number).toEqual(invoice.number);
        expect(result.address.complement).toEqual(invoice.complement);
        expect(result.address.city).toEqual(invoice.city);
        expect(result.address.state).toEqual(invoice.state);
        expect(result.address.zipCode).toEqual(invoice.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(invoice.items[0].id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toEqual(invoice.items[1].id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
    });
});
