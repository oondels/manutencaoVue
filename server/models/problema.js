const { pool } = require("../database/config/config.js");

const criarProblema = async (descricao, categoriaId) => {
  const client = await pool.connect();
  try {
    const nomeProblema = await client.query(
      "INSERT INTO Problema (descricao, categoria_id) VALUES ($1, $2) RETURNING *",
      [descricao, categoriaId]
    );
    return nomeProblema.rows[0];
  } catch (error) {
    console.error("Erro ao criar Problema:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { criarProblema };
