import mysql from 'promise-mysql';
import config from '../config.js';

const connection = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.username,
    password: config.password
});


export function getConnection() {
    return connection;
  }