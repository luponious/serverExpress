import axios from "axios";
import { BASE_URL } from "../config.js";

export function onConnection(socketServer) {
  async function getProducts() {
    return await axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => res.data)
      .catch((err) => console.log(err.message));
  }
  async function deleteProduct(id) {
    console.log("deleteProduct id: ", id);
    return await axios
      .delete(`${BASE_URL}/api/products/${id}`)
      .then((res) => res.data)
      .catch((err) =>
        console.log("deleteProduct error: ", {
          message: err.message,
          data: err.response.data.error,
          status: err.response.status,
        })
      );
  }

  // Add product
  async function addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category
  ) {
    return await axios
      .post(`${BASE_URL}/api/products`, {
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        stock,
        category,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async function getMessages() {
    return await axios
      .get(`${BASE_URL}/api/messages`)
      .then((res) => res.data)
      .catch((err) => console.log("Error on getMessages socket", err));
  }
  // Add Message
  async function addMessage({ username, text }) {
    console.log("addMessage socket: ", { username, text });
    return await axios
      .post(`${BASE_URL}/api/messages`, { username, text })
      .then((res) => res.data)
      .catch((err) => console.log("Error on postMessage socket", err));
  }
  // Delete Message
  async function deleteMessage(id) {
    return await axios
      .delete(`${BASE_URL}/api/messages/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log("Error on deleteMessage socket", err));
    }

    return async function (socket) {
      // User Connected
      socket.broadcast.emit("new-user", socket.handshake.auth.username);
  
      // User Disconnected
      socket.on("disconnecting", () => {
        socket.broadcast.emit(
          "user-disconnected",
          socket.handshake.auth.username
        );
      });
  
      // Get products
      socket.emit("getProducts", await getProducts());
  
      // Delete product
      socket.on("deleteProduct", async (id) => {
        await deleteProduct(id);
        // Emit "getProducts" after delete operation
        socket.emit("getProducts", await getProducts());
      });
  
      // Add product
      socket.on(
        "addProduct",
        async (
          title,
          description,
          price,
          thumbnail,
          code,
          status,
          stock,
          category
        ) => {
          await addProduct(
            title,
            description,
            parseInt(price),
            thumbnail,
            code,
            status,
            parseInt(stock),
            category
          );
          // Emit "getProducts" after add operation
          socket.emit("getProducts", await getProducts());
        }
      );
  
      // Get Chat Messages
      socket.emit("getMessages", await getMessages());
  
      // Delete Message
      socket.on("deleteMessage", async (id) => {
        await deleteMessage(id);
        // Emit "getMessages" after delete operation
        io.emit("getMessages", await getMessages());
      });
  
      // Add Message to DB
      socket.on("addMessage", async (message) => {
        await addMessage(message);
        // Emit "getMessages" after add operation
        io.emit("getMessages", await getMessages());
      });
    };
  }
  
  export function injectSocketServer(socketServer) {
    return function (req, res, next) {
      req.socketServer = socketServer;
      next();
    };
  }