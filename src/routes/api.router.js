import { Router } from "express";
import { productsRouter } from "./products.router.js";
import { cartsRouter } from "./carts.router.js";
import { messagesRouter } from "./messages.router.js";

export const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);
apiRouter.use("/messages", messagesRouter);
