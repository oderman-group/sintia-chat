import server from './app.js';
import { PORT } from "./config.js";



const main = () => {   
    server.listen(PORT);
    console.log(`El servidor inicio en el puerto ${PORT}`);
};

main();