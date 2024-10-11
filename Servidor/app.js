const express  = require('express');
const { PORT } = require('./config.js');
// import morgan from "morgan";
const http     = require('http');
const cors     = require('cors');
var   fs       = require('fs');
const https    = require('https');
const path     = require('path');

const app      = express();


const options = {
    key: fs.readFileSync('key.key'),
    cert: fs.readFileSync('cert.crt'),
    requestCert:false,
    rejectUnauthorized:false
};

//Settings
app.set("port", PORT);

app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
    const host = req.hostname;
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// const server = http.createServer(app);
const server = https.createServer(options,app);

// configuiracion Socket
const configureSocketIO = require('./sockets.js');

configureSocketIO(server);

module.exports = server;