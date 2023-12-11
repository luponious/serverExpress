import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

export const productsRouter = Router();

// GET
productsRouter.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    res.status(200).json(products);
  } catch (error) {
    console.log("Error al obtener los productos con mongoose: ", error);
    res.status(500).json({ error: error.message });
  }
});

// GET BY ID
productsRouter.get("/:id", async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "Falta el ID" });

    const product = await productModel.findById(req.params.id).lean();
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.status(200).json(product);
  } catch (error) {
    console.log("Error al obtener el producto con mongoose: ", error);
    res.status(500).json({ error: error.message });
  }
});

// POST
productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category,
  } = req.body;
  try {
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      return res.status(400).json({ error: "Campos incompletos" });
    }
    const newProduct = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      stock,
      category,
    });
    res.status(200).json({
      message: "Producto creado con éxito",
      data: newProduct,
    });
  } catch (error) {
    console.log("Error al guardar el producto con mongoose: ", error);
    res.status(500).json({ error: error.message || error });
  }
});

// PUT
productsRouter.put("/:id", async (req, res) => {
  console.log("req.body: ", req.body);
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category,
  } = req.body;
  try {
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      return res.status(400).json({ error: "Campos incompletos" });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        stock,
        category,
      },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json({
      message: "Producto actualizado con éxito",
      data: product,
    });
  } catch (error) {
    console.log("Error al actualizar el producto con mongoose: ", error);
    res.status(500).json({ error: error.message || error });
  }
});

// DELETE
productsRouter.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: "Falta el ID" });

    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.status(200).json({
      message: "Producto eliminado con éxito",
      data: product,
    });
  } catch (error) {
    console.log("Error al eliminar el producto con mongoose: ", error);
    res.status(500).json({ error: error.message });
  }
});
