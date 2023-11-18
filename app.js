import express from 'express';
import multer from 'multer';
import ProductManager from './controllers/c_products';
import { createCart, getCart, addToCart } from './controllers/c_carts';

const app = express();
const port = 8080;

// Midw p/ parsear JSONs
app.use(express.json());

// Multer config p/ file uploads (cuando necesario)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Product routes
app.get('/routes/products', ProductManager.getProducts);
app.get('/routes/products/:pid', ProductManager.getProduct);
app.post('/routes/products', upload.single('thumbnail'), ProductManager.addProduct);
app.put('/routes/products/:pid', upload.single('thumbnail'), ProductManager.updateProduct);
app.delete('/routes/products/:pid', ProductManager.deleteProduct);

// Cart routes
app.post('/routes/carts', createCart);
app.get('/routes/carts/:cid', getCart);
app.post('/routes/carts/:cid/product/:pid', addToCart);

app.listen(port, () => {
    console.log(`Server funcionando en el puerto ${port}`);
});
