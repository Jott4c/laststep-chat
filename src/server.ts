import "dotenv/config";
import { io, serverHttp } from "./app";
import chatController from "./controllers/chat/chat.controller";
import "../config/database"

(async () => {
    serverHttp.listen(3002, () => {
    console.log(`Servidor executando`);
   
  });

  io.on("connection", chatController)

})();
