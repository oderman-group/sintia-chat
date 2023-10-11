import { Server } from 'socket.io';
import { methods  as metodosChat} from "./controller/chat.controller.js";

function configureSocketIO(server) {
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

    
    socket.on("listar_mensajes_chat", (body) => {
      console.log("recibi un mensaje del id: " + socket.id + " para litar chat de la sala:" + body["salaChat"]);
      let salaChat = body["salaChat"];
      if (io.sockets.adapter.rooms.has(salaChat)) {
        console.log(`listando chat de sala '${salaChat}'`);
        metodosChat.getlistarChat(body,socket);
      } 
    });

    socket.on("enviar_mensaje_chat", (body) => {
      // console.log("recibi un mensaje del id: " + socket.id + " message:  " + body["chat_mensaje"] + " - para la sala del chat:" + body["salaChat"] + " y sala " + body["sala"]);
      metodosChat.insertMessageCaht(body);
      let salaChat = body["salaChat"];
      let sala = body["sala"];
      if (io.sockets.adapter.rooms.has(salaChat)) {
        console.log(`Sala '${salaChat}' existe.`);
        io.to(body["salaChat"]).emit('nuevo_mensaje_chat', {
          body,
          from: socket.id.slice(8),
        });
      } else {
        console.log(`Sala '${salaChat}' no existe.`);
        console.log(`se enviara la notificacion a la sala  ${sala} `);
        if (io.sockets.adapter.rooms.has(sala)) {
          io.to(sala).emit('notificacion_chat', body);
          metodosChat.contarNotificaciones(body,socket);
        }else{
          console.log(`no se envia a la Sala '${sala}' por que tampoco existe.`);
        }
        

      }


      // socket.broadcast.emit(body["salaChat"], {
      //     body,
      //     from: socket.id.slice(8),
      // });
    });


    socket.on("conectar", (body) => {
      console.log("se coencto un usuario socket id: " + socket.id);

    });

    socket.on("desconectar", (body) => {
      console.log("se descoencto un usuario socket id: " + socket.id);

    });

    socket.on("disconnect", (body) => {
      console.log("se descoencto un usuario socket id: " + socket.id);

    });



  });
}

export default configureSocketIO;
