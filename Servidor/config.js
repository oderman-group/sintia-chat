const config = require('dotenv');

config.config();



module.exports = {
    host: process.env.HOST ,
    username:process.env.USAERNAME,
    database:process.env.DATABASE ,
    password:process.env.PASSWORD,
    PORT:process.env.PORT,
    BD_SOCIAL:process.env.BD_SOCIAL,
    BD_ACADEMICA:process.env.BD_ACADEMICA,
   };