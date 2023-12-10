import { StatusCodes } from 'http-status-codes';
import Product from '../models/products.js';
import Cart from '../models/cart.js';

// Cart Controllers

export const createCart = async (req, res) => {
  try {
    //verificacione y midleware va aca, por hora vamos con eso...
    const userId = req.userId; // substituir por logica p/ pedir user ID

    // init cart vacio
    const newCart = new Cart({
      userId: userId,
      products: [],
      totalPrice: 0,
    });

    // guarda cart en db
    await newCart.save();

    // Responde con cart creado
    res.status(StatusCodes.CREATED).json({ message: 'Cart created successfully.', cart: newCart });
  } catch (error) {
    // devuelve errores
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    // Extract user ID de la request
    const userId = req.userId;

    // busca el cart del usuario basedo en user ID
    const cart = await Cart.findOne({ userId });

    // devuelve cart encontrado
    res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    // busca product
    const product = await Product.findById(pid);

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found.' });
    }

    // busca cart
    let cart = await Cart.findById(cid);

    // // si no existe, se muere, joda, crea uno nuevo
    if (!cart) {
      cart = new Cart({
        userId: cid, // assumimos que cid es el mismo de user ID
        products: [],
        totalPrice: 0,
      });
    }

    // check de producto en cart
    const existingProduct = cart.products.find((item) => item.productId.equals(product._id));

    if (existingProduct) {
      // si ya esta, se actualiza la cantidad
      existingProduct.quantity += quantity;
    } else {
      // sino lo agrega
      cart.products.push({
        productId: product._id,
        quantity,
      });
    }

    // Update precio total
    cart.totalPrice += product.price * quantity;

    // guarda cart
    await cart.save();

    // Res con updated de cart
    res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error.' });
  }
};
