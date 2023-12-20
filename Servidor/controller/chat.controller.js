const connectiondb = require('../connection/database.js');
const {BD_SOCIAL,database,BD_ACADEMICA} = require('../config.js');

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

const insertMessageCorreo = async (req, res) =>{
    try {
        let { emisor, receptor, asunto, contenido, institucion, year} = req;
        if (emisor === undefined || receptor === undefined || asunto === undefined || contenido === undefined || institucion === undefined || year  === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("INSERT INTO "+database+".social_emails(ema_de, ema_para, ema_asunto, ema_contenido, ema_fecha, ema_visto, ema_eliminado_de, ema_eliminado_para, ema_institucion, ema_year) VALUES ('" + emisor + "','" + receptor + "','" + asunto + "','" + contenido + "',now(), 0, 0, 0,'" + institucion + "','" + year + "') RETURNING ema_id");
        connection.end();
        return result[0]["ema_id"];
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

const contarCorreo = async (req, res) =>{
    try {
        let { emisor, receptor, asunto, contenido, institucion, year} = req;
        if (emisor === undefined || receptor === undefined || asunto === undefined || contenido === undefined || institucion === undefined || year  === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("SELECT COUNT(*) AS cantidad FROM "+database+".social_emails WHERE ema_para="+receptor+" AND ema_institucion="+institucion+" AND ema_year="+year+" AND ema_visto=0");
        connection.end();
        return result[0]["cantidad"];
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

const consultarNombre = async (req, res) =>{
    try {
        let { idRecurso, institucion, year} = req;
        if (idRecurso === undefined || institucion === undefined || year  === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("SELECT CONCAT(mat_primer_apellido,' ',mat_segundo_apellido,' ',mat_nombres,' ',mat_nombre2) AS nombre FROM "+BD_ACADEMICA+".academico_matriculas WHERE mat_id='"+idRecurso+"' AND institucion='"+institucion+"' AND year='"+year+"'");
        connection.end();
        return result[0]["nombre"];
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}


module.exports = {
    insertMessageCaht,
    contarNotificaciones,
    actualizarVisto,
    contarMisNotificaciones,
    insertMessageCorreo,
    contarCorreo,
    consultarNombre
};