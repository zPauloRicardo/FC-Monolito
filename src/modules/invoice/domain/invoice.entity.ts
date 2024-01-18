import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "./product.entity";
import Address from "../../@shared/domain/value-object/address";

type InvoiceProps = {
    id?: Id;
    name: string;
    document: string;
    address: {
        street: string;
        number: string;
        complement: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
};
export default class Invoice extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: Product[];

    constructor(props: InvoiceProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._document = props.document;
        this._address = new Address({
            street: props.address.street,
            number: props.address.number,
            complement: props.address.complement,
            city: props.address.city,
            state: props.address.state,
            zipCode: props.address.zipCode,
        });
        this._items = props.items.map(
            (item) =>
                new Product({id: new Id(item.id), name: item.name, price: item.price})
        );
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }

    get items(): Product[] {
        return this._items;
    }

    get total(): number {
        return this._items.reduce((total, item) => {
            return total + item.price;
        }, 0);
    }
}
