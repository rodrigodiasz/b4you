import Redis from "ioredis";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string),
});

export default redis;
