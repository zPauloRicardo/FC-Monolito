import { Request, Response, Router } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRouter = Router();

productRouter.post("/", async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();
  try {
    const output = await facade.addProduct({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      salesPrice: req.body.salesPrice,
      stock: req.body.stock,
    });
    res.status(201).send(output);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      console.error(error)
      res.status(500).send({ message: error.message });
    }
  }
});
