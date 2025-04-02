require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Configuração do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


app.use(cors());
app.use(express.json());

// Rota para buscar todas as tarefas
app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks");
  res.json(result.rows);
});

// Rota para adicionar uma tarefa
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const result = await pool.query("INSERT INTO tasks (title) VALUES ($1) RETURNING *", [title]);
  res.json(result.rows[0]);
});

// Rota para marcar como concluído
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *", [id]);
  res.json(result.rows[0]);
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
