import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { createCart, getCart, addToCart } from './controllers/cartController'; // Adjust the path based on your project structure
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/productController'; // Adjust the path based on your project structure

const app = express();
const port = 8080;

// Middleware to parse JSONs
app.use(express.json());

// Multer config for file uploads (if necessary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
const uri = "mongodb+srv://lupo:orhaTmTqfTHMjkE8@potatocluster.sngsvvj.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Product routes
app.get('/routes/products', getProducts);
app.get('/routes/products/:pid', getProduct);
app.post('/routes/products', upload.single('thumbnail'), addProduct);
app.put('/routes/products/:pid', upload.single('thumbnail'), updateProduct);
app.delete('/routes/products/:pid', deleteProduct);

// Cart routes
app.post('/routes/carts', createCart);
app.get('/routes/carts/:cid', getCart);
app.post('/routes/carts/:cid/product/:pid', addToCart);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

