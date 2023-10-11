import mysql from 'promise-mysql';
import config from '../config.js';



const getConnection=async (req, res) =>{
   const  connection = mysql.createConnection({
        host: config.host,
        database: config.database,
        user: config.username,
        password: config.password
    });
    return connection;
}


export const methods = {
    getConnection
};
