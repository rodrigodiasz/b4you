import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { Product } from "../models/product";
import axios from "axios";
import * as yup from "yup";
import redis from "../lib/redis";

const router = Router();

const productSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  price: yup
    .number()
    .typeError("Preço deve ser um número")
    .min(1, "Preço não pode ser 0 ou negativo")
    .required("Preço é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  stock: yup
    .number()
    .typeError("Estoque deve ser um número")
    .integer("Estoque deve ser inteiro")
    .min(1, "Estoque não pode ser 0 ou negativo")
    .required("Estoque é obrigatório"),
  category: yup.string().required("Categoria é obrigatória"),
});

// Listar todas as categorias únicas
router.get("/categories", authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["category"],
      raw: true,
    });
    const categorySet = new Set(
      products.map((p) => p.category).filter(Boolean)
    );
    const categoryList = Array.from(categorySet);
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// Listar todos
router.get("/", authenticateToken, async (req, res) => {
  const cacheKey = "products:all";
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  const products = await Product.findAll();
  await redis.set(cacheKey, JSON.stringify(products), "EX", 60); // cache por 60 segundos
  res.json(products);
});

// Obter um
router.get("/:id", authenticateToken, async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Produto não encontrado" });
  res.json(product);
});

// Criar
router.post("/", authenticateToken, async (req, res) => {
  try {
    const data = await productSchema.validate(req.body, { abortEarly: false });
    const product = await Product.create(data);
    res.status(201).json(product);
    await redis.del("products:all");
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(400).json({ error: err.errors.join(", ") });
    }
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// Atualizar
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const data = await productSchema.validate(req.body, { abortEarly: false });
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado" });
    await product.update(data);
    res.json(product);
    await redis.del("products:all");
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(400).json({ error: err.errors.join(", ") });
    }
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// Deletar
router.delete("/:id", authenticateToken, async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product)
    return res.status(404).json({ error: "Produto não encontrado" });
  await product.destroy();
  res.status(204).send();
  await redis.del("products:all");
});

// Sugestão de IA para nome ou descrição
router.post("/ai-suggest", authenticateToken, async (req, res) => {
  const { field, context } = req.body;
  if (!field || !["name", "description"].includes(field)) {
    return res.status(400).json({ error: "Campo inválido para sugestão" });
  }

  const prompt =
    field === "name"
      ? `Gere um nome de produto otimizado para SEO, Devolva apenas o nome, sem nenhum outro texto. Contexto: ${
          context || ""
        }`
      : `Gere uma descrição de produto otimizada para SEO, persuasiva e clara. Devolva apenas a descrição, sem nenhum outro texto. Contexto: ${
          context || ""
        }`;

  try {
    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em SEO para e-commerce.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: field === "name" ? 20 : 120,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY as string}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = openaiRes.data as {
      choices: { message: { content: string } }[];
    };
    const suggestion = data.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (err: any) {
    console.error(
      "Erro ao consultar OpenAI:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "Erro ao gerar sugestão com IA" });
  }
});

export default router;
