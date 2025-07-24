import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET = process.env.JWT_SECRET as string;
const USER = { email: process.env.EMAIL as string, password: process.env.PASSWORD as string };

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== USER.email || password !== USER.password) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

export default router;
