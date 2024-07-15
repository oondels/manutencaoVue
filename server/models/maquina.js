const { pool } = require("../database/config/config.js");

const criarMaquina = async (nome) => {
  const client = await pool.connect();
  try {
    const nemMaquina = await client.query(
      "INSERT INTO Maquina (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    return nemMaquina.rows[0];
  } catch (error) {
    console.error("Erro ao criar Maquina:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { criarMaquina };
