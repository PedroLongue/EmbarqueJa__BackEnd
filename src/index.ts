import express from "express";

require("dotenv").config();

const PORT = process.env.PORT
const app = express();


//routes
const router = require("./routes/Router.ts");

app.use(router);


//DB connextion
require("./config/db.ts");

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
