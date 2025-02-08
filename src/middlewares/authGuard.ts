import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

interface IAuthRequest extends Request {
  user?: string;
}

export const authGuard = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //check if header has a token
  if (!token) return res.status(401).json({ erros: ["Acesso negado!"] });

  //check if token if valid
  try {
    const verified = jwt.verify(token, jwtSecret);

    req.user = await User.findById(verified.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ erros: ["Token inválido"] });
  }
};
