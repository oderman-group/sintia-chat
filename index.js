import server from './Servidor/app.js';
import { PORT } from "./Servidor/config.js";


const main = () => {   
    server.listen(PORT);
    console.log(`El servidor inicio en el puerto ${PORT}`);
};

main();