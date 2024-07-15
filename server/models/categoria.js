const { pool } = require("../database/config/config.js");

const criarCategoria = async (nome) => {
  const client = await pool.connect();
  try {
    const newCategoria = await client.query(
      "INSERT INTO Categoria (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    return newCategoria.rows[0];
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { criarCategoria };
