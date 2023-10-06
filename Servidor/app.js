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


//importar rutas


//Rutas
app.use(chat);


// configuiracion Socket
// import configureSocketIO from './sockets.js';

// configureSocketIO(server);


const io = new Server(server, {});
io.on("connection", (socket) => {
    console.log("usuario conectado con Skect id: " + socket.id);

    socket.on('join', (salaChat) => {
        socket.join(salaChat); // El nombre de usuario se usa como el nombre de la sala
        console.log(`se creó la sala ${salaChat}`);
      });
      socket.on('leave', (salaChat) => {
        socket.leave(salaChat);
        console.log(`Usuario dejó la sala '${salaChat}'`);
      });

    socket.on("enviar_mensaje_chat", (body) => {
        console.log("recibi un mensaje del id: " + socket.id + " message:  " + body["chat_mensaje"]+" - para la sala del chat:"+body["salaChat"] +" y sala "+body["sala"]); 
        metodosChat.insertMessageCaht(body);
        let salaChat=body["salaChat"];
        let sala=body["sala"];
        if (io.sockets.adapter.rooms.has(salaChat)) {

            console.log(`Sala '${salaChat}' existe.`);
            io.to(body["salaChat"]).emit('nuevo_mensaje_chat', {
                body,
                from: socket.id.slice(8),
                 });  

          } else {

            console.log(`Sala '${salaChat}' no existe.`);
            console.log(`se enviara la notificacion a la sala  ${sala} `);
            io.to(sala).emit('notificacion_chat',body);  
            
          }
      
             
        // socket.broadcast.emit(body["salaChat"], {
        //     body,
        //     from: socket.id.slice(8),
        // });
    });
    

    socket.on("conectar", (body) => {
        console.log("se coencto un usuario socket id: " + socket.id ); 
        
    });

    socket.on("desconectar", (body) => {
        console.log("se descoencto un usuario socket id: " + socket.id );        
       
    });

    socket.on("disconnect", (body) => {
        console.log("se descoencto un usuario socket id: " + socket.id );        
       
    });

    

});


// app.use((req, res, next) => {
//     req.io = io;
//     req.com = getConnection;
//     next();
// });

export default server;