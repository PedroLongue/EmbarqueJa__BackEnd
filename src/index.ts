import express from "express";
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//routes
const router = require("./routes/Router.ts");

app.use(express.json());

app.use(router);

//DB connextion
require("./config/db.ts");

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
