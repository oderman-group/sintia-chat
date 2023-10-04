import { getConnection } from '../connection/database.js'
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {});

function notificar(llaveChat, nuevoDato) {
    console.log(llaveChat + ":" + nuevoDato);
    io.on(llaveChat, (data) => {
        console.log("recibi un mensaje del id: " + data + " message:  " + data.body);
    });
}
const listarChat = async (req, res) => {
    try {
        console.log(req.params);
        const { chat_remite_usuario, chat_destino_usuario } = req.params;
        const whereSql = { chat_remite_usuario, chat_destino_usuario };

        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM mobiliar_sintia_social.chat WHERE chat_remite_usuario = '" + chat_remite_usuario + "' AND  chat_destino_usuario = '" + chat_destino_usuario + "'");

        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }

    //res.json("aca ba la lista de todos los  chats");    
};

const insertarMensaje = async (req, res) => {
    try {
        const { chat_mensaje, chat_remite_usuario, chat_destino_usuario } = req.body;
        if (chat_mensaje === undefined || chat_remite_usuario === undefined || chat_destino_usuario === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO mobiliar_sintia_social.chat(chat_remite_usuario,chat_destino_usuario,chat_mensaje) VALUES ('" + chat_remite_usuario + "','" + chat_destino_usuario + "','" + chat_mensaje + "')");
        notificar(chat_remite_usuario + "_mensagge_" + chat_destino_usuario, chat_mensaje);
        res.json({ result: " Mensaje guardado con exito!" });
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }

    //res.json("aca ba la lista de todos los  chats");    
};

export const methods = {
    listarChat,
    insertarMensaje,
    notificar
};