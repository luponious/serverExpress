import fs from "fs/promises";
import { randomUUID } from "node:crypto";

class CartManager {
  constructor(path = "./db/carts.json") {
    this.path = path;
  }

  async initialize() {
    try {
      await fs.readFile(this.path, "utf-8");
    } catch (error) {
      console.log("Base de datos no encontrada. Creando...");
      await this.createDefaultDB();
    }
  }

  async createDefaultDB() {
    try {
      await fs.writeFile(this.path, JSON.stringify([], null, 2));
      console.log("Base de datos creada exitosamente.");
    } catch (error) {
      console.log("Error al crear la base de datos: ", error);
      throw error;
    }
  }
  async createCart() {
    try {
      const newCart = {
        id: randomUUID(),
        products: [],
      };

      const carts = await this.#getCarts();
      carts.push(newCart);

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito: ", error);
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async #getCarts() {
    try {
      const carts = await fs.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.log("getCarts error: ", error.code);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.#getCarts();
      const cart = carts.find((cart) => cart.id === id);
      if (!cart) {
        throw new Error(`Carrito con id ${id} no encontrado`);
      }

      console.log("Carrito encontrado: ", cart);
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const carts = await this.#getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        throw new Error(`Carrito con id ${cartId} no encontrado`);
      }

      const productToAdd = { product: productId, quantity };

      const existingProductIndex = carts[cartIndex].products.findIndex(
        (item) => item.product === productId
      );

      if (existingProductIndex !== -1) {
        carts[cartIndex].products[existingProductIndex].quantity += quantity;
        if (carts[cartIndex].products[existingProductIndex].quantity <= 0) {
          carts[cartIndex].products.splice(existingProductIndex, 1);
          await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
          return carts[cartIndex];
        }
      } else {
        if (quantity <= 0) {
          throw new Error(
            `No se puede agregar un producto con cantidad ${quantity}`
          );
        }
        carts[cartIndex].products.push(productToAdd);
      }

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return carts[cartIndex];
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }
}

const cartManager = new CartManager();
await cartManager.initialize();

export default cartManager;
