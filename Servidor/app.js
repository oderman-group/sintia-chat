import express from "express";
import morgan from "morgan";

import http from "http";

import { Server } from "socket.io";

import { PORT } from "./config.js";
import cors from "cors";

import chat from "./routes/chat.routers.js";

// Initializations
const app = express();
const server = http.createServer(app);

import configureSocketIO from './sockets.js';

configureSocketIO(server);


//Settings
app.set("port", PORT);

// Middlewares
app.get('/', (req, res) => { res.send('<h1>SINTIA API</h1>') })
app.use(cors());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas
app.use(chat);




// const io = new Server(server,{});
// io.on("connection", (socket) => {
//     console.log("usuario conectado con Skect id: "+socket.id);
  
//   });

//   io.on("mensaje", (body) => {
//     console.log("recibi un mensaje del id: "+socket.id+" message:  "+body);
//     socket.broadcast.emit("message", {
//       body,
//       from: socket.id.slice(8),
//     });
//   });


export default server;