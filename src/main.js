import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import { BASE_URL, MONGODB_URL } from "./config.js";
import {
  injectSocketServer,
  onConnection,
} from "./sockets/socket.controller.js";
import { apiRouter } from "./routes/api.router.js";
import { webRouter } from "./routes/web.router.js";

const app = express();
app.engine("handlebars", handlebars.engine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(8080, () => {
  const DB_STATUS = mongoose.connect(MONGODB_URL);
  if (DB_STATUS) console.log(`HABEMUS DB! Conectado a: ${BASE_URL}`);
});

// Socket.io
const webSocketServer = new Server(server);

// Websocket server
webSocketServer.on("connection", onConnection(webSocketServer));
app.use(injectSocketServer(webSocketServer));

// Public files
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("static"));

// routers
app.use("/", webRouter);
app.use("/api", apiRouter);
