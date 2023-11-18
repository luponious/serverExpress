import express from 'express';
import multer from 'multer';
import { getProduct, getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/c_products';

const router = express.Router();
const upload = multer();

// Routes . HTTP methods
router.get('/', getProducts);
router.get('/:pid', getProduct);
//multer config -> upload.NONE() -> Estas rutas se ocupan de actualizar la información del producto y no esperan ninguna carga de archivos.
router.post('/', upload.none(), addProduct); 
router.put('/:pid', upload.none(), updateProduct);
router.delete('/:pid', deleteProduct);

export default router;
