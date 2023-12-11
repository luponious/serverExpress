import cartManager from "../dao/services/CartManager.js";

export async function createCart(req, res) {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCartById(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Falta el parámetro 'id'" });

    const cart = await cartManager.getCartById(id);
    if (!cart) {
      res
        .status(404)
        .json({ error: `No se encontró ningún carrito con el ID ${id}.` });
    } else res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function addProductToCart(req, res) {
  try {
    const { id, pid } = req.params;
    const { quantity } = req.body;

    // Validar si pid y quantity están presentes en la solicitud
    if (!pid || !quantity) {
      return res.status(400).json({ error: "Se requieren pid y quantity." });
    }

    if (isNaN(quantity)) {
      return res.status(400).json({ error: "quantity debe ser un número." });
    }
    const updatedCart = await cartManager.addProductToCart(id, pid, quantity);
    if (!updatedCart.products.length) {
      return res.json({
        data: updatedCart,
        message: "El producto fue eliminado del carrito.",
      });
    }
    return res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
