import { Request, Response } from "express";
const express = require("express");
const router = express();

router.get("/api", (req: Request, res: Response) => {
  res.send("API Working!");
});

router.use("/api/users", require("./UserRoutes"));

module.exports = router;
