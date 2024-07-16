const { criarCategoria } = require("./categoria");
const { criarMaquina } = require("./maquina");
const { criarSetor } = require("./setor");
const { criarProblema } = require("./problema");
const { relacaoSetorMaquina } = require("./relacao_setor_maquina");

module.exports = {
  criarCategoria,
  criarMaquina,
  criarSetor,
  criarProblema,
  relacaoSetorMaquina,
};
