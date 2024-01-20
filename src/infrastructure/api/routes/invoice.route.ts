import { Request, Response, Router } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRouter = Router();

invoiceRouter.get("/:id", async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();
  try {
    const output = await facade.find({
      id: req.params.id,
    });
    res.status(200).send(output);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      res.status(500).send({ message: error.message });
    }
  }
});
