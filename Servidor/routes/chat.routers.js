import { Router } from "express";
import { methods  as metodosChat} from "../controller/chat.controller.js";

const router = new Router();

//router.get('/chat/find/:chat_remite_usuario/:chat_destino_usuario', metodosChat.listarChat);
// router.post('/chat/insert', metodosChat.insertarMensaje);


export default router;