import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

interface IAuthRequest extends Request {
  user?: string;
}

export const requireAdmin = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user);
  if (!user || !user.isAdmin) {
    return res
      .status(403)
      .json({ error: "Acesso restrito a administradores." });
  }
  next();
};
