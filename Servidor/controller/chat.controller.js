const connectiondb = require('../connection/database.js');
const {BD_SOCIAL} = require('../config.js');

const actualizarVisto = async (req, res) =>{
    try {
        let { chat_id } = req;
        if (chat_id === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
            
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("UPDATE "+BD_SOCIAL+".chat SET chat_visto = 0 WHERE chat_id =" + chat_id);
        console.log(`se actualizo el chat con id ${chat_id} `); 
        connection.end();
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

const insertMessageCaht = async (req, res) =>{
    try {
        let { chat_mensaje, chat_remite_usuario, chat_destino_usuario,chat_tipo,chat_url_file,chat_remite_institucion,chat_destino_institucion} = req;
        if (chat_mensaje === undefined || chat_remite_usuario === undefined || chat_remite_institucion === undefined || chat_destino_usuario === undefined ||chat_destino_institucion  === undefined ||chat_tipo === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        if( chat_url_file === undefined){
            chat_url_file=null;
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("INSERT INTO "+BD_SOCIAL+".chat(chat_remite_usuario,chat_remite_institucion,chat_destino_usuario,chat_destino_institucion,chat_mensaje,chat_tipo,chat_url_file)"+ 
                                               "VALUES ('" + chat_remite_usuario + "','" + chat_remite_institucion+ "','" + chat_destino_usuario+ "','" + chat_destino_institucion + "','" + chat_mensaje + "','" + chat_tipo + "','" + chat_url_file + "') RETURNING chat_id");
        connection.end();
        return result[0]["chat_id"];
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}
const contarNotificaciones = async (req, res) =>{
    try {
        const {chat_remite_usuario, chat_destino_usuario,chat_remite_institucion,chat_destino_institucion} = req;
        if (chat_remite_usuario === undefined || chat_destino_usuario === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("SELECT COUNT(*) AS cantidad FROM "+BD_SOCIAL+".chat WHERE " +
        "chat_remite_usuario = '" + chat_remite_usuario + "' AND  chat_destino_usuario = '" + chat_destino_usuario + "' AND " +
        "chat_remite_institucion = '" + chat_remite_institucion + "' AND  chat_destino_institucion = '" + chat_destino_institucion + "' AND " +
        "chat_visto = 1 "+
        "ORDER BY chat_fecha_registro ASC");    
        console.log(`mensajes sin leer de ${chat_destino_usuario} de la institucion ${chat_destino_institucion} (${result[0]["cantidad"]})`);        
        connection.end();
        return result[0]["cantidad"];
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

const contarMisNotificaciones = async (req) =>{
    try {
        const { chat_destino_usuario,chat_destino_institucion } = req;
        if ( chat_destino_usuario === undefined) {
            console.log({ result: " Los campos de envios no estan completos" });
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("SELECT COUNT(*) AS cantidad FROM "+BD_SOCIAL+".chat WHERE " +
        "chat_destino_usuario = '" + chat_destino_usuario + "' AND " +
        "chat_destino_institucion = '" + chat_destino_institucion + "' AND " +
        "chat_visto = 1 "+
        "ORDER BY chat_fecha_registro ASC");    
        console.log(`en total hay  (${result[0]["cantidad"]}) mensajes sin leer de ${chat_destino_usuario}`);        
        connection.end();
        return result[0]["cantidad"];
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    insertMessageCaht,
    contarNotificaciones,
    actualizarVisto,
    contarMisNotificaciones
};