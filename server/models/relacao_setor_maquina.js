const { pool } = require("../database/config/config.js");

const relacaoSetorMaquina = async (setorId, maquinaId) => {
  const client = await pool.connect();
  try {
    const relacao = await client.query("INSERT INTO public.maquina_setor (setor_id, maquina_id) VALUES ($1, $2) RETURNING *", [setorId, maquinaId]);
    return relacao.rows[0];
  } catch (error) {
    console.error("Erro ao criar relação de setor e máquina:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { relacaoSetorMaquina };
