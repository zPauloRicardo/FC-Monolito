import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";

import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacadeInterface from "../facade/checkout-facade.interface";
import { CheckoutFacade } from "../facade/checkout.facade";
import { CheckoutRepository } from "../gateway/checkout.repository";
import { PlaceOrderUsecase } from "../usecase/place-order/place-order.usecase";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacadeInterface {
    const repository = new CheckoutRepository();
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFacadeFactory.create();
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const placeOrderUseCase = new PlaceOrderUsecase(
      repository,
      clientAdmFacade,
      productAdmFacade,
      storeCatalogFacade,
      invoiceFacade,
      paymentFacade
    );

    return new CheckoutFacade({ placeOrderUseCase });
  }
}
