const server = require('./Servidor/app.js');
const { PORT } = require('./Servidor/config.js');

 
server.listen(PORT);
console.log(`El servidor inicio en el puerto ${PORT}`);

