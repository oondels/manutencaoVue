const { pool } = require("../database/config/config.js");

const criarMaquina = async (nome) => {
  const client = await pool.connect();
  try {
    const newMaquina = await client.query("INSERT INTO public.maquinas (name) VALUES ($1) RETURNING *", [nome]);
    return newMaquina.rows[0];
  } catch (error) {
    console.error("Erro ao criar Maquina:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { criarMaquina };
