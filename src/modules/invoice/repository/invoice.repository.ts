import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import {InvoiceProductModel} from "./invoice-product.model";
import {InvoiceModel} from "./invoice.model";
import Address from "../../@shared/domain/value-object/address";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        const result = await InvoiceModel.create(
            {
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
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                })),
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt
            },
            {
                include: [{model: InvoiceProductModel}],
            }
        );
    }

    async find(id: string): Promise<Invoice> {
        let invoice;

        // try {
        invoice = await InvoiceModel.findOne({
            where: {
                id,
            },
            rejectOnEmpty: true,
            include: InvoiceProductModel,
        });
        // } catch (error) {
        //   throw new Error("Invoice not found");
        // }

        return new Invoice({
            id: new Id(id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode,
            }),
            items: invoice.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
        });
    }
}
