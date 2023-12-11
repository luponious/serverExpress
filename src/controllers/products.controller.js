import productManager from "../services/ProductManager.js";
import { validateLimit, validateProductId } from "../utils/validations.js";

// working
export async function getProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit);
    if (limit) validateLimit(limit);

    const products = await productManager.getProducts(limit);

    if (products.length === 0) {
      res.status(404).json({ error: "No se encontraron productos." });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Working
export async function getProductById(req, res) {
  try {
    if (!req.params.id)
      return res.status(400).json({ error: "Falta el parámetro 'id'" });

    const id = parseInt(req.params.id);
    validateProductId(id);

    const product = await productManager.getProductById(id);
    if (!product) {
      res
        .status(404)
        .json({ error: `No se encontró ningún producto con el ID ${id}.` });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Working
export async function addProduct(req, res) {
  try {
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

    const product = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      stock,
      category
    );
    res.json({
      status: 201,
      message: "Producto agregado correctamente.",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

// Working
export async function updateProductById(req, res) {
  try {
    if (!req.params.id) {
      res.status(400).json({ error: "Falta el parámetro 'id'" });
      return;
    }
    const id = parseInt(req.params.id);
    validateProductId(id);

    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      throw new Error(
        "Se requieren datos válidos para actualizar el producto."
      );
    }

    const product = await productManager.updateProductById(id, updates);

    if (!product) {
      res
        .status(404)
        .json({ error: `No se encontró ningún producto con el ID ${id}.` });
    } else {
      res.json({
        status: 201,
        message: "Producto actualizado correctamente.",
        data: product,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Working
export async function deleteProductById(req, res) {
  try {
    if (!req.params.id) {
      res.status(400).json({ error: "Falta el parámetro 'id'" });
      return;
    }
    const id = parseInt(req.params.id);
    validateProductId(id);
    const products = await productManager.deletrProductById(id);
    res.json({
      status: 201,
      message: "Producto eliminado correctamente.",
      data: products,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
