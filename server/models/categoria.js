const { pool } = require("../database/config/config.js");

const criarCategoria = async (nome, maquinaId) => {
  const client = await pool.connect();
  try {
    const newCategoria = await client.query("INSERT INTO public.categoria (name, maquina_id) VALUES ($1, $2) RETURNING *", [nome, maquinaId]);
    return newCategoria.rows[0];
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { criarCategoria };
