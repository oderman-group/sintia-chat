const connectiondb = require('../connection/database.js');

const insertMessageCaht = async (req, res) =>{
    try {
        let { chat_mensaje, chat_remite_usuario, chat_destino_usuario,chat_tipo,chat_url_file } = req;
        if (chat_mensaje === undefined || chat_remite_usuario === undefined || chat_destino_usuario === undefined || chat_tipo === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        if( chat_url_file === undefined){
            chat_url_file=null;
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("INSERT INTO mobiliar_sintia_social.chat(chat_remite_usuario,chat_destino_usuario,chat_mensaje,chat_tipo,chat_url_file)"+ 
                                               "VALUES ('" + chat_remite_usuario + "','" + chat_destino_usuario + "','" + chat_mensaje + "','" + chat_tipo + "','" + chat_url_file + "')");
        connection.end();
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}
const contarNotificaciones = async (req, res) =>{
    try {
        const { chat_mensaje, chat_remite_usuario, chat_destino_usuario } = req;
        if (chat_mensaje === undefined || chat_remite_usuario === undefined || chat_destino_usuario === undefined) {
            res.status(400).json({ result: " Los campos de envios no estan completos" });
        }
        const connection = await connectiondb.getConnection();
        const result = await connection.query("SELECT COUNT(*) AS cantidad FROM mobiliar_sintia_social.chat WHERE " +
        "chat_remite_usuario = '" + chat_destino_usuario + "' AND  chat_destino_usuario = '" + chat_remite_usuario + "' AND " +
        "chat_visto = 0 "+
        "ORDER BY chat_fecha_registro ASC",function(error,results,fields9){
                if(error){
                    throw error
                }
                
                results.forEach(element => {
                    console.log(element);
                });
        });    
        connection.end();
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
}

const  getlistarChat= async (req, socket) =>{
    const { chat_remite_usuario, chat_destino_usuario } = req;
    const connection =  await connectiondb.getConnection();
    const result = await connection.query("SELECT * FROM mobiliar_sintia_social.chat WHERE " +
        "(chat_remite_usuario = '" + chat_remite_usuario + "' AND  chat_destino_usuario = '" + chat_destino_usuario + "') OR " +
        "(chat_remite_usuario = '" + chat_destino_usuario + "' AND  chat_destino_usuario = '" + chat_remite_usuario + "')" +
        "ORDER BY chat_fecha_registro ASC");
        console.log(`listando en  listar_mensajes_chat${chat_remite_usuario}  el resultado de ('${result.length}') converasaciones`);
        socket.emit('listar_chat_'+chat_remite_usuario+'_'+chat_destino_usuario, { 
            status:"OK",
            count:result.length,
            data: result });
       connection.end();     
       
    } 

module.exports = {
    insertMessageCaht,
    contarNotificaciones,
    getlistarChat
};