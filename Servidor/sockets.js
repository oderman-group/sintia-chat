const SocketIo = require('socket.io');
const { getlistarChat,
  insertMessageCaht,
  contarNotificaciones,
  contarMisNotificaciones,
  actualizarVisto,
  insertMessageCorreo,
  contarCorreo,
  consultarNombre,
  insertMessageModulosDev } = require('./controller/chat.controller.js');

function configureSocketIO(server) {
  const io = SocketIo(server);

  io.on("connection", (socket) => {// se contrala la coneccion realizada desde el clinete
    console.log(socket.id + "Usuario conectado en Sintia");

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
      console.log(socket.id + " se notifica a la sala: " + sala);
      socket.broadcast.emit("notificacion_"+sala, chat_mis_vistos);
    });

    socket.on("ver_mensaje", async (body) => {
      await actualizarVisto(body);
      let salaChat = body["salaChat"];
      let chaId = body["chat_id"];
      console.log(socket.id + " Envia visto a la sala: poner_visto_" + salaChat+" con ID:"+chaId);
      io.emit("poner_visto_"+salaChat, chaId);
    });

    socket.on("notificar_noticia", async (body) => {
      let institucion = body["institucion"];
      let global = body["global"];
      console.log(socket.id + " se envia a la institucion " + institucion+ " de forma global:"+global);
      if(global == 'NO'){
        socket.broadcast.emit("ver_noticia_"+institucion,body);
      }else{        
        socket.broadcast.emit("ver_noticia",body);
      }
      
    });

    socket.on("actualizar_notificaciones", async (body) => {
      let miSala = body["miSala"];      
      var chat_mis_vistos = await contarMisNotificaciones(body);// consulto cuantos visto tiene el susuario para notificar
      console.log(socket.id + " se actualiza la sala :" + miSala+" con :("+chat_mis_vistos+") notificaciones");
      socket.emit("notificacion_"+miSala, chat_mis_vistos);
    });

    socket.on("enviar_mensaje_correo", async (data) => {
      ema_id    = await insertMessageCorreo(data);
      numCorreo = await contarCorreo(data);
      data["ema_id"] = ema_id;
      data["numCorreo"] = numCorreo;
      if (data["ema_id"] != null || data["ema_id"] !== '' || data["ema_id"] !== undefined) {
        io.emit('recibio_correo_'+data['receptor']+'_'+data['institucion'], data);
      }
      io.emit('envio_correo_'+data['emisor']+'_'+data['institucion'], data);
    });

    socket.on("solicitud_desbloqueo", async (data) => {
      nombre = await consultarNombre(data);
      data["nombre"] = nombre;
      socket.broadcast.emit('notificar_solicitud_desbloqueo_'+data['institucion'], data);
    });

    socket.on("enviar_mensajes_modulos_dev", async (data) => {
      await insertMessageModulosDev(data);
      io.emit('recibio_correo_modulos_dev_1_22', data);
    });

    socket.on("disconnect", (body) => {
      console.log("se descoencto un usuario socket id:------>" + socket.id);
    });

  });
}

module.exports = configureSocketIO;

