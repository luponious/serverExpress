import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";

export const cartsRouter = Router();

// GET
cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find().lean();
    return res.status(200).json(carts);
  } catch (error) {
    console.log("Error al obtener los carts con mongoose: ", error);
    return res.status(500).json({ error: error.message || error });
  }
});

// GET BY ID
cartsRouter.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "Falta el ID" });
    const cart = await cartModel.findById(req.params.id).lean();
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    return res.status(200).json(cart);
  } catch (error) {
    console.log("Error al obtener los carts con mongoose: ", error);
    return res.status(500).json({ error: error.message || error });
  }
});

// POST
cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({});
    if (!newCart)
      return res.status(404).json({ error: "Error al crear el carrito" });
    return res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ error: error.message || error });
  }
});

// POST: Add product to cart by ID
cartsRouter.post("/:id/product/:pid", async (req, res) => {
  try {
    const { id, pid } = req.params;
    const { quantity } = req.body;

    if (!pid || !quantity) {
      return res.status(400).json({ error: "Se requieren pid y quantity." });
    }

    if (isNaN(quantity)) {
      return res.status(400).json({ error: "quantity debe ser un número." });
    }

    const cart = await cartModel.findById(id);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    let existingProduct = cart.products.find((product) => product._id === pid);

    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);

      if (existingProduct.quantity <= 0) {
        cart.products = cart.products.filter((product) => product._id !== pid);
      }
    } else {
      if (parseInt(quantity) <= 0) {
        return res.status(400).json({
          error: "No se puede agregar un producto con cantidad menor 0",
        });
      }

      cart.products.push({
        _id: pid,
        quantity: parseInt(quantity),
      });
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({ error: error.message || error });
  }
});
