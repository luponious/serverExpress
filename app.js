import express from 'express';
import multer from 'multer';
import ProductManager from './controllers/c_products.js';
import { createCart, getCart, addToCart } from './controllers/c_carts.js';


//Rotas
import cartRoutes from './routes/carts.js';
import productRouter from './routes/products.js';

const app = express();
const port = 8080;

// Midw p/ parsear JSONs
app.use(express.json());

// Multer config p/ file uploads (cuando necesario)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Product routes
app.use('/routes/products', productRouter);

// Use the cart routes
app.use('/routes/carts', cartRoutes);


app.listen(port, () => {
    console.log(`Server funcionando en el puerto ${port}`);
});
