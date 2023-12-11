import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

// call coleccion carts
const cartCollection = "carts";

// Define esquema la colección cart
const cartSchema = new Schema(
  {
    //_id generado con randomUUID
    _id: { type: String, default: randomUUID },
    //almacena un array de objetos con _id y quant
    products: {
      type: [
        {
          _id: { type: String, required: true, ref: "Product" },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      //array vacío por def
      default: [],
    },
  },
  {
    // throw error en caso de campos no definidos
    strict: "throw",
    // Deshabilita el campo de versión automática en los documentos
    versionKey: false,
  }
);

export const cartModel = model(cartCollection, cartSchema);
