import { Schema, model } from "mongoose";
import { randomUUID } from "node:crypto";

const messageCollection = "messages";

const messageSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);

export const messageModel = model(messageCollection, messageSchema);
