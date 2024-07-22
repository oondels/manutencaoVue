const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const http = require("http");
const cors = require("cors");
const { pool } = require("./database/config/config");
const { criarCategoria, criarMaquina, criarProblema, criarSetor, relacaoSetorMaquina } = require("./models/index");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const app = express();
const port = 3000;
const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8080",
  })
);
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
app.use((req, res, next) => {
  res.cookie("csrfToken", req.csrfToken(), {
    secure: true,
    httpOnly: true,
    sameSite: "Strict",
  });
  next();
});

server.listen(port, () => {
  console.log("Servidor rodando na porta:", port);
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/api/manual_maqs", async (req, res) => {
  try {
    const client = await pool.connect();

    const query = `
      SELECT
          s.id AS setor_id,
          s.nome AS setor_nome,
          m.id AS maquina_id,
          m.nome AS maquina_nome,
          c.id AS categoria_id,
          c.nome AS categoria_nome,
          json_agg(p.*) AS problemas
      FROM Setor s
      JOIN maquina_setor sm ON s.id = sm.setor_id
      JOIN Maquinas m ON sm.maquina_id = m.id
      LEFT JOIN Categoria c ON m.id = c.maquina_id
      LEFT JOIN Problema p ON c.id = p.categoria_id
      GROUP BY s.id, m.id, c.id
    `;

    const result = await client.query(query);
    client.release();

    let manualMaquinas = {};

    result.rows.forEach((row) => {
      const setorNome = row.setor_nome;
      const maquinaNome = row.maquina_nome;
      const categoriaNome = row.categoria_nome;
      const solucoes = row.problemas;

      if (!manualMaquinas[setorNome]) {
        manualMaquinas[setorNome] = {};
      }

      if (!manualMaquinas[setorNome][maquinaNome]) {
        manualMaquinas[setorNome][maquinaNome] = {};
      }

      if (!manualMaquinas[setorNome][maquinaNome][categoriaNome]) {
        manualMaquinas[setorNome][maquinaNome][categoriaNome] = [];
      }

      solucoes.forEach((solucao) => {
        if (solucao) {
          manualMaquinas[setorNome][maquinaNome][categoriaNome].push(solucao.descricao);
        }
      });
    });

    res.json(manualMaquinas);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados de manualmaquinas" });
  }
});

app.post("/cadastro-maquina", csrfProtection, async (req, res) => {
  const newManual = req.body;

  try {
    for (const setorNome in newManual) {
      const setor = await criarSetor(setorNome);

      const maquinas = newManual[setorNome];
      for (const maquinaNome in maquinas) {
        const maquina = await criarMaquina(maquinaNome);
        await relacaoSetorMaquina(setor.id, maquina.id);

        const categorias = maquinas[maquinaNome];
        for (const categoriaNome in categorias) {
          const categoria = await criarCategoria(categoriaNome, maquina.id);

          const problemas = categorias[categoriaNome];
          for (const problemaNome of problemas) {
            await criarProblema(problemaNome, categoria.id);
          }
        }
      }
    }
    return res.status(201).json({ message: "Máquina cadastrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar os dados:", error);
    return res.status(500).json({ erro: `Error: ${error}` });
  }
});

app.post("/register", async (req, res) => {
  const { userInput, senhaInput } = req.body;
  const senhaEncoded = await bcrypt.hash(senhaInput, 10);

  try {
    await User.create({
      user: userInput,
      senha: senhaEncoded,
    });
    res.status(201).redirect("/login");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userInput, senhaInput } = req.body;
  } catch (error) {
    console.error("Erro ao buscar Usuário:", error);
  }
});
