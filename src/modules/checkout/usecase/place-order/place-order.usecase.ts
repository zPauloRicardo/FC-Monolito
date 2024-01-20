import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import { Client } from "../../domain/client.entity";
import { Order } from "../../domain/order.entity";
import { Product, ProductProps } from "../../domain/product.entity";
import { CheckoutGateway } from "../../gateway/checkout.gateway";
import {
  PlaceOrderInputDto,
  PlaceOrderOutputDto,
  ProductTypes,
} from "./place-order.dto";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import Address from "../../../@shared/domain/value-object/address";

export class PlaceOrderUsecase implements UseCaseInterface {
  constructor(
    private readonly repository: CheckoutGateway,
    private readonly clientAdmFacade: ClientAdmFacadeInterface,
    private readonly productAdmFacade: ProductAdmFacadeInterface,
    private readonly storeCatalogFacade: StoreCatalogFacadeInterface,
    private readonly invoiceFacade: InvoiceFacadeInterface,
    private readonly paymentFacade: PaymentFacadeInterface
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const found = await this.clientAdmFacade.find({ id: input.clientId });
    if (!found) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((product) => this.getProduct(product.productId))
    );

    const client = new Client({
      id: new Id(found.id),
      name: found.name,
      email: found.email,
      address: new Address({
        street: found.address.street,
        number: found.address.number,
        complement: found.address.complement,
        city: found.address.city,
        state: found.address.state,
        zipCode: found.address.zipCode,
      }),
    });


    const order = new Order({
      client,
      products,
    });

    const payment = await this.paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoice =
      payment.status === "approved"
        ? await this.invoiceFacade.generate({
            name: found.name,
            document: found.document,
            street: found.address.street,
            number: found.address.number,
            city: found.address.city,
            state: found.address.state,
            zipCode: found.address.zipCode,
            complement: found.address.complement,
            items: products.map((product) => {
              return {
                id: product.id.id,
                name: product.name,
                price: product.salesPrice,
              };
            }),
          })
        : null;

    payment.status === "approved" && order.approved();
    await this.repository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.id,
      })),
    };
  }

  private validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }
    return this.checkStock(input.products);
  }

  private async checkStock(products: ProductTypes[]): Promise<void> {
    for (const { productId } of products) {
      const product = await this.productAdmFacade.checkStock({ productId });
      if (product.stock <= 0) {
        throw new Error(`Product ${productId} is not available in stock`);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this.storeCatalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }
    const productProps: ProductProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
    return new Product(productProps);
  }
}
