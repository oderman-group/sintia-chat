import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { resolve, dirname } from "path";

import { PORT } from "./config.js";
import cors from "cors";

// Initializations

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// Middlewares
app.get('/', (req, res) => { res.send('<h1>Aplicacion de CHAT</h1>') })
app.use(cors());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve("frontend/dist")));

io.on("connection", (socket) => {
  console.log("usuario conectado con Skect id: " + socket.id);
  socket.on("mensaje", (body) => {
    console.log("recibi un mensaje del id: " + socket.id + " message:  " + body["message"]);
    socket.broadcast.emit("mensaje", {
      body,
      from: socket.id.slice(8),
    });
  });
  socket.on('mensaje', (data) => {
    console.log(`Mensaje recibido: ${data}`);
    const { username, message } = data;
    console.log(`el mensaje  ${message} fue enviado al chat: ${username}`);
    io.to(username).emit('mensaje', data);
  });
  socket.on('join', (username) => {
    socket.join(username);
    console.log(`${username} se ha unido a su sala de chat`);
  });
});

server.listen(PORT);
console.log(`El servidor inicio en el puerto ${PORT}`);