import express from 'express';
import multer from 'multer';
import { getCart, createCart, addToCart } from '../controllers/c_carts';

const router = express.Router();
const upload = multer();

// Routes
router.post('/', upload.none(), createCart);
router.get('/:cid', getCart);
router.post('/:cid/product/:pid', upload.none(), addToCart);

export default router;
