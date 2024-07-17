<template>
  <div class="container">
    <div class="wrapper">
      <div class="title">
        <v-img src="@/assets/maintenance.png"></v-img>
        <h1>TPM - Manual de Máquinas</h1>
      </div>
      <div class="pesquisa">
        <div class="select-lists">
          <v-select clearable class="select" label="Setores" :items="listaSetores" v-model="setor"></v-select>
          <v-select class="select" label="Maquinas" :items="listaMaquinas" v-model="maquina"></v-select>
        </div>
        <v-btn @click="getMaquinas">Pesquisa</v-btn>
        <v-btn>Cadastrar</v-btn>
      </div>
      <div class="main">
        <div class="setores-list" v-for="(maquinas, setorNome) in maquinasObject" :key="setorNome">
          <h1>{{ setorNome }}</h1>

          <div class="maquinas-list" v-if="maquinas">
            <div class="maquina" v-for="(categorias, maquinaNome) in maquinas" :key="maquinaNome">
              <v-expansion-panels>
                <v-expansion-panel :title="maquinaNome">
                  <v-expansion-panel-text>
                    <div class="categoria" v-for="(problemas, categoriaNome) in categorias" :key="categoriaNome">
                      <h3 @click="toggleCategoria(setorNome, maquinaNome, categoriaNome)" class="toggle-button"></h3>

                      <v-expansion-panels>
                        <v-expansion-panel :title="categoriaNome">
                          <v-expansion-panel-text>
                            <ul class="problemas-list">
                              <li class="problema-item" v-for="(problema, problemaId) in problemas" :key="problemaId">
                                <h4>{{ problema }}</h4>
                                <v-img :src="getIcon(problema)"></v-img>
                                <span style="display: none" class="text-message">Span</span>
                              </li>
                            </ul>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
          <div v-else><h2>Sem máquinas no setor!</h2></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mecanicoIcon from "@/assets/mecanico-icon.png";
import operacionalIcon from "@/assets/operador-icon.png";
import axios from "axios";

export default {
  name: "ManutencaoComponent",
  data() {
    return {
      setor: "",
      maquina: "",
      maquinasObject: {},
      categoriasCheck: false,
      problemasCheck: false,
      listaSetores: [],
      listaMaquinas: [],
    };
  },
  mounted() {
    this.getMaquinas();
  },
  watch: {
    setor(newSetor) {
      this.updateListaMaquinas(newSetor);
    },
  },
  methods: {
    getMaquinas() {
      const params = {};
      if (this.setor) params.setor = this.setor;
      if (this.maquina) params.maquina = this.maquina;
      axios
        .get("http://localhost:3000/api/manual_maqs", { params })
        .then((response) => {
          this.maquinasObject = response.data;

          Object.keys(this.maquinasObject).forEach((setorNome) => {
            this.listaSetores.push(setorNome);
          });
          if (this.setor) {
            this.updateListaMaquinas(this.setor);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      this.setor = "";
      this.maquina = "";
    },
    updateListaMaquinas(setor) {
      this.listaMaquinas = [];
      if (this.maquinasObject && this.maquinasObject[setor]) {
        this.listaMaquinas = Object.keys(this.maquinasObject[setor]);
      } else {
        this.listaMaquinas = [];
      }
    },
    getIcon(problema) {
      if (problema.includes("Mecânico")) {
        return mecanicoIcon;
      } else if (problema.includes("Operacional")) {
        return operacionalIcon;
      }
      return "";
    },
  },
};
</script>

<style>
.select-lists {
  display: flex;
  flex-direction: row;
}

.clear-icon {
  cursor: pointer;
  margin-left: -30px; /* Ajuste o posicionamento do ícone conforme necessário */
  margin-top: 12px; /* Ajuste o posicionamento do ícone conforme necessário */
  color: #757575; /* Cor do ícone */
}

.clear-icon:hover {
  color: #f44336; /* Cor do ícone ao passar o mouse */
}
.title {
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title h1 {
  font-size: 35px;
  color: #0056b3;
  margin-top: 0;
}

.title .v-img {
  width: 150px;
  padding-right: 20px;
}

.select {
  width: 300px;
  padding: 0 10px;
}

.select-lists {
  display: flex;
  flex-direction: row;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  text-decoration: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

body,
html {
  justify-content: center;
  display: flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
  background-color: #e6f0fa; /* Fundo azul claro */
  padding: 20px;
  color: #333; /* Cor do texto */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 1200px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

main {
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
}

.maquinas-list {
  cursor: pointer;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 18px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
}

.maquinas-list:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.categorias-list {
  padding: 18px;
  overflow: hidden;
  background-color: #f1f1f1;
  transition: max-height 0.7s ease, opacity 0.5s ease;
}

.toggle-button {
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 30px;
}

.toggle-button:hover {
  color: #1f75fe;
}

.categoria ul {
  padding: 10px;
}

.categoria ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #333;
  padding: 15px;
  margin-top: 15px;
  list-style-type: none;
  background-color: #fff;
  border-radius: 8px;
}

.categoria .toggle-button {
  padding: 0;
  margin: 10px;
}

.categoria ul li::before {
  content: "🔧";
  margin-right: 10px;
  font-size: 18px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.categoria ul li:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.problema-item {
  min-width: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #333;
  position: relative;
}

.problema-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 90%;
  height: 1px;
  background-color: #ddd;
  margin-left: 5%;
}

.problema-item .v-img {
  position: absolute;
  right: 40px;
  width: 35px;
}

.v-expansion-panel {
  padding: 7px;
}
</style>
