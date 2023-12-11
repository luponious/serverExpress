import fs from "fs/promises";
import {
  validateArrayOfStrings,
  validateType,
  validateUpdates,
} from "../utils/validaciones.js";

class ProductManager {
  #nextId;

  constructor(path) {
    this.path = path;
  }

  async initialize() {
    const productsList = await this.getProducts();
    if (productsList.length > 0) {
      const lastProduct = productsList[productsList.length - 1];
      this.#nextId = lastProduct.id + 1;
    } else {
      this.#nextId = 1;
    }
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category
  ) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Todos los campos son obligatorios, excepto thumbnail");
      }

      validateType(title, "string", "title");
      validateType(description, "string", "description");
      validateType(price, "number", "price");
      validateType(code, "string", "code");
      validateType(stock, "number", "stock");
      validateType(status, "boolean", "status");
      validateType(category, "string", "category");
      validateArrayOfStrings(thumbnail, "thumbnail");

      // Si no se proporciona una miniatura, utiliza una URL predeterminada
      const defaultThumbnailUrl = "//https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnIybGRuZThvZDQwZDF2a2psdWVicXR3cDhiOHg2NWNtd2w3MmNnNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/lPbutip4xD65a1zYtS/giphy.gif";
      const thumbnailToUse = thumbnail.length > 0 ? thumbnail : [defaultThumbnailUrl];

      const productsList = await this.getProducts();

      if (productsList.some((product) => product.code === code)) {
        throw new Error(
          "El código de producto ya existe. No se permite agregar productos duplicados."
        );
      }

      const product = {
        id: this.#nextId++,
        title,
        description,
        price: `$ ${price}`,
        thumbnail,
        code,
        stock,
        status,
        category,
      };

      productsList.push(product);
      await this.#saveProducts(productsList);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async #saveProducts(productsList) {
    try {
      await fs.writeFile(
        this.path,
        JSON.stringify(productsList, null, 2),
        "utf8"
      );
    } catch (error) {
      console.log("saveProducts error: ", error);
    }
  }

  async getProducts(limit) {
    try {
      const productsList = JSON.parse(await fs.readFile(this.path, "utf-8"));
      if (limit) {
        if (isNaN(limit))
          throw new Error("El parámetro limit debe ser un número.");
        return productsList.slice(0, limit);
      }
      return productsList;
    } catch (error) {
      console.log("getProducts error: ", error.code);
      if (error.code === "ENOENT") {
        console.log("ENOENT No existe el archivo. Creando...");
        await this.createDefaultDB();
        return [];
      } else console.log("getProducts error: ", error);
    }
  }

  async createDefaultDB() {
    try {
      await fs.writeFile(this.path, JSON.stringify([], null, 2));
    } catch (error) {
      console.log("Error creating DB: ", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const productsList = await this.getProducts();
      const product = productsList.find((product) => product.id === id);
      if (product) {
        console.log("Producto encontrado: ", product);
        return product;
      } else {
        throw new Error(`Producto con id ${id} no encontrado`);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id, updates) {
    try {
      const productsList = await this.getProducts();
      const productIndex = productsList.findIndex(
        (product) => product.id === id
      );

      if (productIndex !== -1) {
        if (updates.id && updates.id !== id) {
          throw new Error("El ID del producto no puede ser modificado.");
        }

        const allowedProperties = [
          "title",
          "description",
          "price",
          "thumbnail",
          "code",
          "stock",
          "status",
          "category",
        ];

        if (updates.thumbnail)
          validateArrayOfStrings(updates.thumbnail, "thumbnail");
        if (updates.title) validateType(updates.title, "string", "title");
        if (updates.description)
          validateType(updates.description, "string", "description");
        if (updates.price) validateType(updates.price, "number", "price");
        if (updates.code) validateType(updates.code, "string", "code");
        if (updates.stock) validateType(updates.stock, "number", "stock");
        if (updates.status) validateType(updates.status, "boolean", "status");
        if (updates.category)
          validateType(updates.category, "string", "category");

        const verifiedUpdates = validateUpdates(updates, allowedProperties);

        productsList[productIndex] = {
          ...productsList[productIndex],
          ...verifiedUpdates,
        };

        await fs.writeFile(this.path, JSON.stringify(productsList, null, 2));
        return productsList[productIndex];
      } else {
        throw new Error(`Producto con id "${id}" no encontrado`);
      }
    } catch (error) {
      throw error;
    }
  }

  async deletrProductById(id) {
    try {
      const productsList = await this.getProducts();
      const updatedProductsList = productsList.filter(
        (product) => product.id !== id
      );
      if (productsList.length === updatedProductsList.length) {
        throw new Error(`Producto con id "${id}" no encontrado.`);
      }
      await this.#saveProducts(updatedProductsList);
      return updatedProductsList;
    } catch (error) {
      throw error;
    }
  }
}

const productManager = new ProductManager("./db/products.json");
await productManager.initialize();

export default productManager;
