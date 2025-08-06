import express from "express";
import cors from "cors";
import { Dialect, Sequelize } from "sequelize";
import { initProductModel } from "./models/product";
import authRoutes from "./routes/auth";
import productsRoutes from "./routes/products";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Inicializar Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
    logging: false,
  }
);

// Inicializar models
initProductModel(sequelize);

// Configuração segura de CORS para permitir apenas o frontend
const allowedOrigins = [process.env.CORS_ORIGIN as string];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("API funcionando!");
});

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
