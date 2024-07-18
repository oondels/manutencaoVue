<template>
  <div class="container">
    <div class="wrapper">
      <div class="title">
        <v-img src="@/assets/maintenance.png"></v-img>
        <h1>TPM - Manual de Máquinas</h1>
      </div>
      <div class="pesquisa">
        <div class="select-lists">
          <div class="setor-select select">
            <p>Selecione um Setor</p>
            <v-select clearable class="select" label="Setores" :items="listaSetores" v-model="setor"></v-select>
          </div>
          <div class="maquina-select select">
            <p>Selecione uma Máquina</p>
            <v-select class="select" label="Maquinas" :items="listaMaquinas" v-model="maquina"></v-select>
          </div>
        </div>
        <v-btn class="pesquisa-btn" @click="displayMaquinas">Pesquisar</v-btn>
        <div class="escolher-categoria">
          <p>Deseja aplicar um filtro?</p>
          <v-btn @click="updateDisplayMaquinas('Mecânico')">Mecânico</v-btn>
          <v-btn @click="updateDisplayMaquinas('Operacional')">Operacional</v-btn>
        </div>

        <div class="cadastro-painel">
          <v-expansion-panels class="expandir-button">
            <v-expansion-panel class="cadastrar-maquina" title="Cadastrar Máquina">
              <v-expansion-panel-text>
                <cadastro-maquinas-component />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
      <div class="main">
        <diWv class="setores-list" v-for="(maquinas, setorNome) in maquinasObject" :key="setorNome">
          <h1>{{ setorNome }}</h1>

          <div class="maquinas-list" v-if="maquinas">
            <div class="maquina" v-for="(categorias, maquinaNome) in maquinas" :key="maquinaNome">
              <v-expansion-panels>
                <v-expansion-panel class="toggle-button" :title="maquinaNome">
                  <v-expansion-panel-text>
                    <div class="categoria" v-for="(problemas, categoriaNome) in categorias" :key="categoriaNome">
                      <h3 @click="toggleCategoria(setorNome, maquinaNome, categoriaNome)"></h3>

                      <v-expansion-panels>
                        <v-expansion-panel class="toggle-button" :title="categoriaNome">
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
        </diWv>
      </div>
    </div>
  </div>
</template>

<script>
import mecanicoIcon from "@/assets/mecanico-icon.png";
import operacionalIcon from "@/assets/operador-icon.png";
import axios from "axios";
import CadastroMaquinasComponent from "./CadastroMaquinasComponent.vue";

export default {
  name: "ManutencaoComponent",
  components: {
    CadastroMaquinasComponent,
  },
  data() {
    return {
      setor: "",
      maquina: "",
      maquinasObject: {},
      maquinasObjectOriginal: {},
      name: "",
      nameRules: [(v) => !!v || "Name is required", (v) => (v && v.length <= 10) || "Name must be less than 10 characters"],
      select: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
    };
  },
  mounted() {
    this.displayMaquinas();
  },
  watch: {
    setor(newSetor) {
      this.updateListaMaquinas(newSetor);
    },
  },
  methods: {
    displayMaquinas() {
      const params = {};
      if (this.setor) params.setor = this.setor;
      if (this.maquina) params.maquina = this.maquina;
      axios
        .get("http://localhost:3000/api/manual_maqs", { params })
        .then((response) => {
          this.maquinasObject = response.data;
          this.maquinasObjectOriginal = JSON.parse(JSON.stringify(this.maquinasObject));

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
    updateDisplayMaquinas(selecao) {
      this.maquinasObject = JSON.parse(JSON.stringify(this.maquinasObjectOriginal));

      const newMaquinasObject = {};
      for (const setor in this.maquinasObject) {
        newMaquinasObject[setor] = {};
        for (const maquina in this.maquinasObject[setor]) {
          newMaquinasObject[setor][maquina] = {};
          for (const categoria in this.maquinasObject[setor][maquina]) {
            newMaquinasObject[setor][maquina][categoria] = [];
            this.maquinasObject[setor][maquina][categoria].forEach((solucao) => {
              if (solucao.includes(selecao)) {
                newMaquinasObject[setor][maquina][categoria].push(solucao);
              }
            });
          }
        }
      }
      this.maquinasObject = newMaquinasObject;
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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
* {
  font-family: "Poppins", sans-serif;
}
.v-expansion-panel-text__wrapper {
  border-radius: 10px;
}
.select-lists {
  display: flex;
  flex-direction: row;
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

.select {
  display: flex;
  flex-direction: column;
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
  background-color: #e6f0fa;
  padding: 20px;
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
  padding-top: 30px;
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
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  border-bottom: rgba(0, 0, 0, 0.1) 1px solid;
}

.maquinas-list:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.toggle-button {
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 5px;
}

.v-expansion-panel.cadastrar-maquina {
  background: #5dad70 !important;
  color: #fff !important;
}

.pesquisa-btn {
  background: #007bff !important;
  color: #fff !important;
  margin-bottom: 20px;
}

.toggle-button:hover {
  color: #1f75fe;
}

.cadastro-painel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.categoria ul {
  padding: 10px;
}

.categoria ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  color: #333;
  padding: 20px;
  margin-top: 10px;
  list-style-type: none;
  background: #f9f9f9;
  border-radius: 8px;
  transition: transform 0.2s;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 600px;
}

.v-expansion-panel-text__wrapper {
  padding: 10px !important;
}

.categoria ul li:hover {
  transform: translateY(-5px);
}

.categoria .toggle-button {
  padding: 0;
  margin: 10px;
  font-size: 20px !important;
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

.problema-item {
  min-width: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  color: #333;
  position: relative;
}

.problema-item .v-img {
  position: absolute;
  right: 10px;
  width: 35px;
}

.v-expansion-panel {
  padding: 7px;
}

@media (max-width: 1200px) {
  .select-lists {
    flex-direction: column;
  }

  .select {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .wrapper {
    padding: 20px;
  }

  .title h1 {
    font-size: 28px;
  }

  .title .v-img {
    width: 100px;
  }

  .pesquisa-btn {
    max-width: 100%;
  }

  .categoria ul li {
    min-width: auto;
  }

  .problemas-list li h4 {
    font-size: 14px;
    margin-right: 15px;
  }

  .problema-item .v-img {
    position: absolute;
    right: 10px;
    width: 32px;
  }
}

@media (max-width: 480px) {
  .title h1 {
    font-size: 24px;
  }

  .wrapper {
    padding: 0;
  }
  .title .v-img {
    width: 80px;
  }

  .v-expansion-panel-text__wrapper {
    padding: 0 !important;
  }
  .categoria ul li {
    flex-direction: column;
    align-items: flex-start;
  }

  .problema-item {
    flex-direction: column;
    align-items: flex-start;
  }

  body,
  html {
    padding: 10px;
  }
}
</style>
