import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    let { limit = 5, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const options = {
      page,
      limit,
      lean: true,
      sort:
        sort === "desc" ? { price: -1 } : sort === "asc" ? { price: 1 } : null,
    };

    const filter = query ? { category: query } : {};

    const products = await productModel.paginate(filter, options);

    const response = {
      status: "success",
      hasDocuments: products.docs.length > 0,
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? page - 1 : null,
      nextPage: products.hasNextPage ? page + 1 : null,
      page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${page - 1}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${page + 1}`
        : null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Error al obtener los productos con mongoose: ", error);
    res.status(500).json({ error: error.message });
  }
});


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
