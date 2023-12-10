import express from 'express';
import { getProduct, getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/c_products.js';


const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProduct);
router.post('/', addProduct); 
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;

