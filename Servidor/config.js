import { config } from "dotenv";

config();

export const PORT =  process.env.PORT;

export default {
 host: process.env.HOST ,
 username:process.env.USAERNAME,
 database:process.env.DATABASE ,
 password:process.env.PASSWORD 
};