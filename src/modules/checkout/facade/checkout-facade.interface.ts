export interface ProductFacadeTypes {
  productId: string;
}

export interface PlaceOrderFacadeInputDTO {
  clientId: string;
  products: ProductFacadeTypes[];
}

export interface PlaceOrderFacadeOutputDTO {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: ProductFacadeTypes[];
}

export default interface CheckoutFacadeInterface {
  placeOrder(
    input: PlaceOrderFacadeInputDTO
  ): Promise<PlaceOrderFacadeOutputDTO>;
}
