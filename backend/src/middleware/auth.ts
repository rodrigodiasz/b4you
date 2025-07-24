import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ error: "Token inválido ou expirado" });
    (req as any).user = user;
    next();
  });
}
