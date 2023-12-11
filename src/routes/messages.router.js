import { Router } from "express";
import { messageModel } from "../dao/models/message.model.js";

export const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  try {
    const messages = await messageModel.find().lean();
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error chat.res no encontrado: ", error);
    res.status(500).json({ error: error.message || error });
  }
});

messagesRouter.post("/", async (req, res) => {
  const { username, text } = req.body;
  try {
    if (!username || !text) {
      return res.status(400).json({ error: "Campos incompletos" });
    }
    const newMessage = await messageModel.create({
      username,
      text,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("El menssage no llegó al server: ", error);
    res.status(500).json({ error: error.message || error });
  }
});
