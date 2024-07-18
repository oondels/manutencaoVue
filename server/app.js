const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const http = require("http");
const cors = require("cors");
const { pool } = require("./database/config/config");
const { criarCategoria, criarMaquina, criarProblema, criarSetor, relacaoSetorMaquina } = require("./models/index");

const app = express();
const port = 3000;
const server = http.createServer(app);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const authLogin = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).redirect("/login");
  }
};

server.listen(port, () => {
  console.log("Servidor rodando na porta:", port);
});

app.get("/tables", async (req, res) => {
  const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
  res.json(results);
});

app.get("/api/manual_maqs", async (req, res) => {
  const { setor, maquina } = req.query;

  let setorQuery = "";
  let maquinaQuery = "";
  const values = [];

  if (setor) {
    setorQuery = "AND s.nome = $1";
    values.push(setor);
  }

  if (maquina) {
    maquinaQuery = setor ? "AND m.nome = $2" : "AND m.nome = $1";
    values.push(maquina);
  }

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
      WHERE 1=1 ${setorQuery} ${maquinaQuery}
      GROUP BY s.id, m.id, c.id
    `;

    const result = await client.query(query, values);
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

app.post("/cadastro-maquina", async (req, res) => {
  const newManual = req.body;
  console.log(newManual);

  try {
    // for (const setorNome in newManual) {
    //   const setor = await criarSetor(setorNome);

    //   const maquinas = newManual[setorNome];
    //   for (const maquinaNome in maquinas) {
    //     const maquina = await criarMaquina(maquinaNome);
    //     await relacaoSetorMaquina(setor.id, maquina.id);

    //     const categorias = maquinas[maquinaNome];
    //     for (const categoriaNome in categorias) {
    //       const categoria = await criarCategoria(categoriaNome, maquina.id);

    //       const problemas = categorias[categoriaNome];
    //       for (const problemaNome of problemas) {
    //         await criarProblema(problemaNome, categoria.id);
    //       }
    //     }
    //   }
    // }
    return res.status(201).json({ message: "Máquina cadastrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar os dados:", error);
    res.status(500).json({ erro: `Error: ${error}` });
  }
});

app.post("/register-user", async (req, res) => {
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

app.post("/login-token", async (req, res) => {
  try {
    const { userInput, senhaInput } = req.body;

    const user = await User.findOne({ where: { user: userInput } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const testPassword = await bcrypt.compare(senhaInput, user.senha);
    if (!testPassword) {
      return res.status(401).json({ error: "Senha Incorreta!" });
    }

    req.session.userId = user.id;
    req.session.userAdmin = user.admin;

    res.redirect(`/manualmaquinas`);
  } catch (error) {
    console.error("Erro ao buscar Usuário:", error);
  }
});

app.post("/enviar-cadastro", (req, res) => {
  const newManual = req.body;

  const cadastroMaq = async () => {
    try {
      // Pegar id do setor selecionado
      const fidSetorId = async (nome) => {
        const setor = await Setor.findOne({ where: { nome } });
        return setor ? setor.id : null;
      };

      for (setorNome in newManual) {
        const setorId = await fidSetorId(setorNome);

        const maquinas = newManual[setorNome];
        for (maquinaNome in maquinas) {
          const maquina = await Maquina.create({
            nome: maquinaNome,
            setorId: setorId,
          });

          const categorias = maquinas[maquinaNome];
          for (const categoriaNome in categorias) {
            const categoria = await Categoria.create({
              nome: categoriaNome,
              maquinaId: maquina.id,
            });

            const problemas = categorias[categoriaNome];
            for (const problemaNome of problemas) {
              await Problema.create({
                descricao: problemaNome,
                categoriaId: categoria.id,
              });
            }
          }
        }
      }

      console.log("Dados adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar os dados:", error);
    }
  };

  cadastroMaq();

  res.json(newManual);
});
