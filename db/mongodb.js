import mongoose from "mongoose";
import { MONGODB_URL } from "../src/config.js";

await mongoose.connect(MONGODB_URL);

export { usuariosManager } from "./Usuario.js";
