const manual_maquinas = require("./manual_maqs_noSQL.json");
const {
  criarCategoria,
  criarMaquina,
  criarProblema,
  criarSetor,
  relacaoSetorMaquina,
} = require("../models/index");

async function maquinasDB() {
  try {
    for (const setorNome in manual_maquinas) {
      const setor = await criarSetor(setorNome);

      const maquinas = manual_maquinas[setorNome];
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

    console.log("Dados adicionados com Sucesso!");
  } catch (error) {
    console.log("Erro ao adicionar as informações no banco de dados:", error);
  }
}

maquinasDB();
