export interface ProductTypes {
  productId: string;
}

export interface PlaceOrderInputDto {
  clientId: string;
  products: ProductTypes[];
}

export interface PlaceOrderOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: ProductTypes[];
}
