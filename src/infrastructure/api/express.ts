import express from "express";
import { checkoutRouter } from "./routes/checkout.route";
import { clientRouter } from "./routes/client.route";
import { invoiceRouter } from "./routes/invoice.route";
import { productRouter } from "./routes/product.route";

export const app = express();
app.use(express.json());
app.use("/products", productRouter);
app.use("/clients", clientRouter);
app.use("/checkout", checkoutRouter);
app.use("/invoice", invoiceRouter);
