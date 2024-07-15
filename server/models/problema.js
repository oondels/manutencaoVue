const { pool } = require("../database/config/config.js");

const criarProblema = async (descricao) => {
  const client = await pool.connect();
  try {
    const nomeProblema = await client.query(
      "INSERT INTO Problema (descricao) VALUES ($1) RETURNING *",
      [descricao]
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
