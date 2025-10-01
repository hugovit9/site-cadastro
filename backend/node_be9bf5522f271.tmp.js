require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');

const app = express();
const allowedOrigins = ['https://hugovit9.github.io'];

app.use(cors({
    origin: function (origin, callback) {
      
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


app.use(bodyParser.json());

// conectar ao MongoDB
const mongoURI = process.env.MONGO_URI;


mongoose.connect(mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB Atlas conectado"))
.catch(err => {
    console.error("Erro ao conectar Mongo:", err.message);
});

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);


app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

       
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
             return res.status(400).json({ error: "Este e-mail já está registrado." });
        }

        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();

        res.json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
        console.error("Erro no registro:", err);
        res.status(500).json({ error: "Erro interno do servidor ao registrar." });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
