import { PlaceOrderUsecase } from "../usecase/place-order/place-order.usecase";
import CheckoutFacadeInterface, {
  PlaceOrderFacadeInputDTO,
  PlaceOrderFacadeOutputDTO,
} from "./checkout-facade.interface";

export interface UseCaseProps {
  placeOrderUseCase: PlaceOrderUsecase;
}

export class CheckoutFacade implements CheckoutFacadeInterface {
  private readonly placeOrderUseCase: PlaceOrderUsecase;

  constructor(props: UseCaseProps) {
    this.placeOrderUseCase = props.placeOrderUseCase;
  }

  placeOrder(
    input: PlaceOrderFacadeInputDTO
  ): Promise<PlaceOrderFacadeOutputDTO> {
    return this.placeOrderUseCase.execute(input);
  }
}
