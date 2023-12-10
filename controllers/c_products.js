import { StatusCodes } from 'http-status-codes';
import Product from '../models/products.js';

const ProductController = {
  getProducts: async (req, res) => {
    try {
      const { limit } = req.query;
      let query = {};

      if (limit) {
        query = Product.find().limit(parseInt(limit, 10));
      } else {
        query = Product.find();
      }

      const products = await query.exec();
      res.json({ products });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await Product.findOne({ id: pid });

      if (product) {
        res.json({ product });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found.' });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  },

  addProduct: async (req, res) => {
    try {
      const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;

      if (!title || !description || !code || !price || !stock || !category) {
        throw new Error('All fields except thumbnails are required.');
      }

      const newProduct = new Product({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });

      await newProduct.save();
      res.json({ product: newProduct });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const updatedFields = req.body;

      if (!Object.keys(updatedFields).length) {
        throw new Error('No fields provided for update.');
      }

      const product = await Product.findOneAndUpdate({ id: pid }, { $set: updatedFields }, { new: true });

      if (product) {
        res.json({ product });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found.' });
      }
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const result = await Product.deleteOne({ id: pid });

      if (result.deletedCount > 0) {
        res.json({ message: 'Product deleted successfully.' });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found.' });
      }
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  },
};

export default ProductController;
