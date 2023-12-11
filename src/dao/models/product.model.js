import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

const productCollection = "products";

const productSchema = new Schema({
  _id: { type: String, default: randomUUID },
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  price: { type: String, required: true },
  thumbnail: { type: Array, required: true },
  code: { type: String, required: true, unique: true },
  status: { type: Boolean, required: false },
  stock: { type: Number, required: true },
  category: { type: String, required: true, max: 100 },
  timestamp: { type: Date, default: Date.now },
});

export const productModel = model(productCollection, productSchema);
