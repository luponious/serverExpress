import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

const userCollection = "users";
const userSchema = new Schema(
    {
        // _id con randomUUID
        _id: { type: String, default: randomUUID },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: { type: Number },
        password: { type: String, required: true },
        cart: { type: String, ref: "Cart" }, // Reference al cartModel
        role: { type: String, default: 'user' },
    },
    {
        strict: "throw",
        versionKey: false,
    }
);

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
    try {
        const user = this;
        // solo lo hace si es nuevo/update
        if (!user.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        // Hash del password
        const hash = await bcrypt.hash(user.password, salt);
        // substituye por el haseado
        user.password = hash;
        return next();
    } catch (error) {
        return next(error);
    }
});

export const userModel = model(userCollection, userSchema);
