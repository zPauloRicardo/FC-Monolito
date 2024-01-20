import { Request, Response, Router } from "express";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/facade.factory";


export const checkoutRouter = Router();

checkoutRouter.post("/", async (req: Request, res: Response) => {
  const facade = CheckoutFacadeFactory.create();
  try {
    const output = await facade.placeOrder({
      clientId: req.body.clientId,
      products: req.body.products.map((product: any) => ({
        productId: product,
      })),
    });
    res.status(201).send(output);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});
