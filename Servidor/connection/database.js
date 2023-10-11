const mysql = require('promise-mysql');
const config = require('../config.js');


const getConnection=async (req, res) =>{
   const  connection = mysql.createConnection({
        host: config.host,
        database: config.database,
        user: config.username,
        password: config.password
    });
    return connection;
}

module.exports = {
    getConnection
};