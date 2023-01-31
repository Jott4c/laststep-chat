import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors"
import  http  from "http"
import { Server } from "socket.io";

const app = express();
const serverHttp = http.createServer(app)
const io = new Server(serverHttp)

app.use(cors())
app.use(express.json());


export {serverHttp, io, app};
