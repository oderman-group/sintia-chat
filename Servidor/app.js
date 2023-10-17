const express = require('express');
const { PORT } = require('./config.js');
// import morgan from "morgan";
const http = require('http');
const cors = require('cors');
var fs = require('fs');
const https = require('https'); 



// import chat from "./routes/chat.routers.js";
// import { methods  as metodosChat} from "./controller/chat.controller.js";


// import { Server } from 'socket.io';

// Initializations
const app = express();
const server = http.createServer(app);

const server2 = https.createServer({
//   key: fs.readFileSync('path/key.pem'),
//   cert: fs.readFileSync('path/cert.pem')
}, app);


//Settings
app.set("port", PORT);

// Middlewares
app.get('/sintia-chat-server', (req, res) => { res.send('<h1>SINTIA API</h1>') });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//Rutas
//app.use(chat);
// configuiracion Socket
const configureSocketIO = require('./sockets.js');
// import configureSocketIO from './sockets.js';
 configureSocketIO(server);

module.exports = server;