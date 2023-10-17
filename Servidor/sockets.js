const SocketIo = require('socket.io');
const { getlistarChat,
  insertMessageCaht,
  contarNotificaciones,
  contarMisNotificaciones,
  actualizarVisto } = require('./controller/chat.controller.js');

function configureSocketIO(server) {
  const io = SocketIo(server);

  io.on("connection", (socket) => {// se contrala la coneccion realizada desde el clinete
    console.log(socket.id + " usuario conectado");

    socket.on("enviar_mensaje_chat", async (body) => {
      chat_id=await insertMessageCaht(body);
      body["chat_id"] = chat_id;
      let salaChat = body["salaChat"];
      let sala = body["sala"];
      let miSala = body["miSala"];
      console.log(socket.id + " envio a la sala chat :" + salaChat);
      socket.broadcast.emit(salaChat, { body, from: socket.id.slice(8), });
      console.log(socket.id + ` me envio el mensaje a mi propia sala:  '${miSala}'.`);
      io.emit(miSala, body);
      console.log(socket.id + " envia a la sala: " + salaChat);
      var chat_visto = await contarNotificaciones(body, socket);// consulto cuantos visto tiene el susuario para notificar
      body["cantidad"] = chat_visto;// lo asigno al body para enviarlo
      socket.broadcast.emit(sala, body);
      var chat_mis_vistos = await contarMisNotificaciones(body, socket);// consulto cuantos visto tiene el susuario para notificar
      socket.broadcast.emit("notificacion_"+sala, chat_mis_vistos);
    });

    socket.on("ver_mensaje", async (body) => {
      await actualizarVisto(body);
    });

    socket.on("actualizar_notificaciones", async (body) => {
      let miSala = body["miSala"];
      var chat_mis_vistos = await contarMisNotificaciones(body);// consulto cuantos visto tiene el susuario para notificar
      socket.emit("notificacion_"+miSala, chat_mis_vistos);
    });

    socket.on("listar_mensajes_chat", (body) => {// escuhamos pedido para listar las conversaciones 
      getlistarChat(body, socket);
    });
    // socket.on('join', (salaChat) => { // escuhamos las salas que se estan creando
    //   socket.join(salaChat);
    //   console.log(`+ se creó la sala ${salaChat}`);
    // });

    // socket.on('leave', (salaChat) => { // escuhamos las salas que se estan cerrando
    //   socket.leave(salaChat);
    //   console.log(`x  se cerro la sala '${salaChat}'`);
    // });

    // socket.on("listar_mensajes_chat", (body) => {// escuhamos pedido para listar las conversaciones 
    //   let salaChat = body["salaChat"];
    //   if (io.sockets.adapter.rooms.has(salaChat)) {// validamos que la sala exista
    //     getlistarChat(body, socket);// emitimos las convesaciones de esa sala
    //   }
    // });

    // socket.on("enviar_mensaje_chat", async (body) => {    // escuhamos cuando nos envian un mensaje    
    //   await insertMessageCaht(body);// insertamos lso datos en la base de datos
    //   let salaChat = body["salaChat"];
    //   let sala = body["sala"];
    //   let miSala = body["miSala"];
    //   console.log(`me envio el mensaje a mi propia sala  '${miSala}'.`);
    //   io.to(miSala).emit('mi_notificacion_chat', body); //intentamos emitirnos nuestro mensaje
    //   if (io.sockets.adapter.rooms.has(salaChat)) {// validamos que la sala esete abierta para enviar el mensaje recibido
    //     console.log(`Sala chat '${salaChat}' existe.`);
    //     io.to(body["salaChat"]).emit('nuevo_mensaje_chat', {// si exite la sala emitimos como nuevo mensaje la sala existente
    //       body,
    //       from: socket.id.slice(8),
    //     });
    //   } else {
    //     console.log(`Sala chat '${salaChat}' no existe.`);
    //     console.log(`se enviara la notificacion a la sala  ${sala} `);
    //     if (io.sockets.adapter.rooms.has(sala)) {// si no existe la enviamos la sala general del usuario 
    //       var chat_visto=await contarNotificaciones(body, socket);// consulto cuantos visto tiene el susuario para notificar
    //       body["cantidad"]=chat_visto;// lo asigno al body para enviarlo
    //       io.to(sala).emit('notificacion_chat', body);

    //     } else {
    //       console.log(`No se envia a la Sala '${sala}' por que tampoco existe.`);// no hacemos nada si el usuario no esta en linea
    //     }
    //   }
    // });
    // socket.on("conectar", (body) => {
    //   console.log("se coencto un usuario socket id: " + socket.id);
    // });
    // socket.on("desconectar", (body) => {
    //   console.log("se descoencto un usuario socket id: " + socket.id);
    // });
    socket.on("disconnect", (body) => {
      console.log("se descoencto un usuario socket id: " + socket.id);
    });

  });
}

module.exports = configureSocketIO;

