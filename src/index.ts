import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { socketHandler } from "./socket/socketHandler";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://31.97.171.60:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

socketHandler(io);

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://31.97.171.60:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Rotas
const router = require("./routes/Router.ts");
app.use(router);

// Banco de dados
require("./config/db.ts");

// Inicia servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
