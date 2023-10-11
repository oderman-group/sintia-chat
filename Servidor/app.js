import express from "express";
// import morgan from "morgan";

import http from "http";

import { PORT } from "./config.js";
import cors from "cors";

import chat from "./routes/chat.routers.js";
import { methods  as metodosChat} from "./controller/chat.controller.js";


import { Server } from 'socket.io';

// Initializations
const app = express();
const server = http.createServer(app);




//Settings
app.set("port", PORT);

// Middlewares
app.get('/', (req, res) => { res.send('<h1>SINTIA API</h1>') });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use(morgan("dev"));



//Rutas
//app.use(chat);


// configuiracion Socket
import configureSocketIO from './sockets.js';

 configureSocketIO(server);





// app.use((req, res, next) => {
//     req.io = io;
//     req.com = getConnection;
//     next();
// });

export default server;