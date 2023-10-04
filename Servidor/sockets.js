import { Server } from 'socket.io';

  function configureSocketIO(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
      console.log("usuario conectado con Skect id: " + socket.id);
      socket.on('join', (username) => {
        socket.join(username);
        console.log(`${username} se ha unido a su sala de chat`);
      });

      socket.on('mensaje', (data) => {
        console.log(`Mensaje recibido: ${data}`);
        const { username, message } = data;
        console.log(`el mensaje  ${message} fue enviado al chat: ${username}`);
        io.to(username).emit('mensaje', data);
      });

      socket.on('disconnect', () => {
        console.log('Usuario desconectado');
      });
    });
  }

  export default configureSocketIO ;
