const server = require('./Servidor/app.js');
const { PORT, BD_SOCIAL } = require('./Servidor/config.js');

 
server.listen(PORT);
console.log(`El servidor inicio en el puerto ${PORT} conentandose en la BD ${BD_SOCIAL}`);

