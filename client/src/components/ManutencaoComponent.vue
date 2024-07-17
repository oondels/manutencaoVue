<template>
  <div class="container">
    <div class="wrapper">
      <div class="title">
        <v-img src="@/assets/maintenance.png"></v-img>
        <h1>TPM - Manual de Máquinas</h1>
      </div>
      <div class="pesquisa">
        <div class="select-lists">
          <v-select class="select" label="Setores" :items="listaSetores" v-model="setor"></v-select>
          <v-select class="select" label="Maquinas" :items="listaMaquinas" v-model="maquina"></v-select>
        </div>
        <v-btn @click="getMaquinas">Pesquisa</v-btn>
      </div>
      <div class="main">
        <div class="setores-list" v-for="(maquinas, setorNome) in maquinasObject" :key="setorNome">
          <h1>{{ setorNome }}</h1>

          <div class="maquinas-list" v-if="maquinas">
            <div class="maquina" v-for="(categorias, maquinaNome) in maquinas" :key="maquinaNome">
              <h2 @click="toggleMaquina(setorNome, maquinaNome)" class="toggle-button">{{ maquinaNome }}</h2>

              <div v-if="categorias.expandido" class="categorias-list">
                <div class="categoria" v-for="(problemas, categoriaNome) in categorias" :key="categoriaNome">
                  <h3 @click="toggleCategoria(setorNome, maquinaNome, categoriaNome)" class="toggle-button"></h3>

                  <v-expansion-panels>
                    <v-expansion-panel :title="categoriaNome">
                      <v-expansion-panel-text>
                        <ul class="problemas-list">
                          <li class="problema-item" v-for="(problema, problemaId) in problemas" :key="problemaId">
                            <h4>{{ problema }}</h4>
                            <v-img :src="getIcon(problema)"></v-img>
                          </li>
                        </ul>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </div>
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
          const maquinasData = response.data;

          const formattedMaquinas = {};

          Object.keys(maquinasData).forEach((setorNome) => {
            formattedMaquinas[setorNome] = {};

            this.listaSetores.push(setorNome);

            Object.keys(maquinasData[setorNome]).forEach((maquinaNome) => {
              formattedMaquinas[setorNome][maquinaNome] = {};
              formattedMaquinas[setorNome][maquinaNome].expandido = false;

              Object.keys(maquinasData[setorNome][maquinaNome]).forEach((categoriaNome) => {
                formattedMaquinas[setorNome][maquinaNome][categoriaNome] = {};
                formattedMaquinas[setorNome][maquinaNome][categoriaNome] = maquinasData[setorNome][maquinaNome][categoriaNome];
                formattedMaquinas[setorNome][maquinaNome][categoriaNome].expandido = false;
              });
            });
          });

          if (this.setor) {
            this.updateListaMaquinas(this.setor);
          }

          this.maquinasObject = formattedMaquinas;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    toggleMaquina(setorNome, maquinaNome) {
      const setor = this.maquinasObject[setorNome];
      if (setor && setor[maquinaNome]) {
        setor[maquinaNome].expandido = !setor[maquinaNome].expandido;
      }
    },
    toggleCategoria(setorNome, maquinaNome, categoriaNome) {
      const maquina = this.maquinasObject[setorNome][maquinaNome];

      if (maquina && maquina[categoriaNome]) {
        const categoria = maquina[categoriaNome];
        if (categoria && categoria.expandido !== undefined) {
          categoria.expandido = !categoria.expandido;
        }
      }
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
