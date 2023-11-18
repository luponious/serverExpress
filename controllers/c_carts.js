import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes'; //lib p/ errores

const dataFilePath = './productsData.json';

const readProductsFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeProductsToFile = (products) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
};

export const getProducts = (req, res) => {
  try {
    const { limit } = req.query;
    const products = readProductsFromFile();

    if (limit) {
      res.status(StatusCodes.OK).json({ products: products.slice(0, parseInt(limit, 10)) });
    } else {
      res.status(StatusCodes.OK).json({ products });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getProduct = (req, res) => {
  try {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const product = products.find((p) => p.id === pid);

    if (product) {
      res.status(StatusCodes.OK).json({ product });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const addProduct = (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error('Todos los campos son obligatorios excepto thumbnails.');
    }

    if (typeof price !== 'number' || typeof stock !== 'number' || price < 0 || stock < 0) {
      throw new Error('Precio y stock deben ser números no negativos.');
    }

    const id = uuidv4();
    const newProduct = { id, title, description, code, price, stock, category, thumbnails };

    const products = readProductsFromFile();
    products.push(newProduct);
    writeProductsToFile(products);

    res.status(StatusCodes.CREATED).json({ product: newProduct });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const updateProduct = (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    if (!Object.keys(updatedFields).length) {
      throw new Error('Difina los campo(s) obligatorios para actualizar.');
    }

    const products = readProductsFromFile();
    const productIndex = products.findIndex((p) => p.id === pid);

    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      writeProductsToFile(products);

      res.status(StatusCodes.OK).json({ product: products[productIndex] });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Producto no encontrado.' });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const deleteProduct = (req, res) => {
  try {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const updatedProducts = products.filter((p) => p.id !== pid);

    if (updatedProducts.length < products.length) {
      writeProductsToFile(updatedProducts);
      res.status(StatusCodes.OK).json({ message: 'Producto eliminado con éxito.' });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Producto non existe en esta realidad.' });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
