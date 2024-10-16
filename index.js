const server = require('./Servidor/app.js')
const { PORT } = require('./Servidor/config.js');
const os = require('os');
var http = require('http');



// Obtener la hora actual
const obtenerHoraActual = () => {
    const fecha = new Date();
    return fecha.toLocaleString(); // Muestra fecha y hora en formato legible
  };


// Función para obtener la IP de la máquina donde está corriendo el servidor
const getServerIp = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const addresses = networkInterfaces[interfaceName];
      for (const address of addresses) {
        if (address.family === 'IPv4' && !address.internal) {
          return address.address;
        }
      }
    }
    return 'localhost'; // Si no se encuentra, devolver 'localhost'
  };
  
const serverIp = getServerIp();

server.listen(PORT, () => {
    console.log(`El servidor está corriendo en: http://${serverIp}:${PORT}`);
    console.log(`El servidor inicio en el puerto ${PORT} `);
    console.log(`Hora de despliegue: ${obtenerHoraActual()}`);
  });
  