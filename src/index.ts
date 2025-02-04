import express from "express";

require("dotenv").config();

const PORT = process.env.PORT
const app = express();


app.get("/", (req, res) => {
  res.send("Tetsing API!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
