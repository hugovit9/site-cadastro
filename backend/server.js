require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());

// conectar ao MongoDB
const mongoURI = process.env.MONGO_URI;
  mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Atlas conectado"))
  .catch(err => console.error("Erro ao conectar Mongo:", err));


// modelo de usuário
const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);

// rota para registrar usuário
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // salvar no banco
    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();

    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
