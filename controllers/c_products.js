import { v4 as uuidv4 } from 'uuid'; //p/ generar
import fs from 'fs';

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
      res.json({ products: products.slice(0, parseInt(limit, 10)) });
    } else {
      res.json({ products });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = (req, res) => {
  try {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const product = products.find((p) => p.id === pid);

    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProduct = (req, res) => {
  try {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error('All fields except thumbnails are required.');
    }

    const id = uuidv4();
    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };

    const products = readProductsFromFile();
    products.push(newProduct);
    writeProductsToFile(products);

    res.json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    if (!Object.keys(updatedFields).length) {
      throw new Error('No fields provided for update.');
    }

    const products = readProductsFromFile();
    const productIndex = products.findIndex((p) => p.id === pid);

    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      writeProductsToFile(products);

      res.json({ product: products[productIndex] });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = (req, res) => {
  try {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const updatedProducts = products.filter((p) => p.id !== pid);

    if (updatedProducts.length < products.length) {
      writeProductsToFile(updatedProducts);
      res.json({ message: 'Product deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
