import Id from "../../@shared/domain/value-object/id.value-object";
import { Client } from "../domain/client.entity";
import { Order } from "../domain/order.entity";
import { Product } from "../domain/product.entity";
import { CheckoutGateway } from "./checkout.gateway";
import ClientModel from "./client.model";
import OrderModel from "./order.model";
import ProductModel from "./product.model";
import Address from "../../@shared/domain/value-object/address";

export class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    const t = await OrderModel.sequelize.transaction();
    try {
      const model = await OrderModel.create(
        {
          id: order.id.id,
          clientId: order.client.id.id,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
        {
          transaction: t,
        }
      );
      const id = order.products.map((product) => product.id.id);
      await ProductModel.update(
        { orderId: model.id },
        { where: { id }, transaction: t }
      );
      t.commit();
    } catch (error) {
      t.rollback();
      throw new Error("Unable to place order");
    }
  }

  async findOrder(id: string): Promise<Order> {
    const model = await OrderModel.findByPk(id, {
      include: [ProductModel, ClientModel],
    });
    if (!model) {
      throw new Error(`Order with id ${id} not found`);
    }
    return new Order({
      id: new Id(model.id),
      client: new Client({
        id: new Id(model.clientId),
        name: model.client.name,
        email: model.client.email,
        address: new Address({
          street: model.client.street,
          number: model.client.number,
          complement: model.client.complement,
          city: model.client.city,
          state: model.client.state,
          zipCode: model.client.zipCode,
        }),
      }),
      products: model.products.map(
        (product) =>
          new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
          })
      ),
      status: model.status,
    });
  }
}
