const { pool } = require("../database/config/config.js");

const criarSetor = async (nome) => {
  const client = await pool.connect();
  try {
    const newSetor = await client.query("INSERT INTO public.setor (name) VALUES ($1) RETURNING *", [nome]);
    return newSetor.rows[0];
  } catch (error) {
    console.error("Erro ao criar Setor:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { criarSetor };
