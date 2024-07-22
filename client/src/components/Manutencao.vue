<template>
  <h1>TPM - Manual de Máquinas</h1>
  <div class="container">
    <div class="mb-3">
      <v-expansion-panels>
        <v-expansion-panel color="success" title="Cadastrar Máquina">
          <v-expansion-panel-text>
            <cadastro-defeitos />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div class="col-12 row m-0 mb-3">
      <div class="col-6 p-0 pe-1">
        <v-select
          clearable
          variant="outlined"
          density="compact"
          class="select"
          label="Setores"
          :items="listaSetores"
          v-model="setor"
        ></v-select>
      </div>
      <div class="col-6 p-0 ps-1">
        <v-select
          clearable
          variant="outlined"
          density="compact"
          class="select"
          label="Maquinas"
          :items="listaMaquinas"
          v-model="maquina"
        ></v-select>
      </div>
    </div>

    <div class="main">
      <div class="escolher-categoria">
        <p>Deseja aplicar um filtro?</p>
        <v-btn :class="{ active: filtroTipo === 'Mecânico' }" class="categoria-mecanico" @click="filtroDefeitos('Mecânico')"
          >Mecânico</v-btn
        >
        <v-btn
          :class="{ active: filtroTipo === 'Operacional' }"
          class="categoria-operacional"
          @click="filtroDefeitos('Operacional')"
          >Operacional</v-btn
        >
      </div>
      <div class="setores-list" v-for="(maquinas, setorNome) in maquinasObject" :key="setorNome">
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
                          <div v-if="problemas.length > 0">
                            <ul class="problemas-list">
                              <li class="problema-item" v-for="(problema, problemaId) in problemas" :key="problemaId">
                                <h4>{{ problema }}</h4>
                                <!-- <v-img :src="getIcon(problema)"></v-img> -->
                              </li>
                            </ul>
                          </div>
                          <div v-else>
                            <ul class="problemas-list">
                              <li class="problema-item">
                                <h4>
                                  Sem Informações Cadastradas para: <span style="color: blue">{{ this.filtroTipo }}</span>
                                </h4>
                              </li>
                            </ul>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
        <div v-else>
          <h2>Sem máquinas no setor!</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CadastroDefeitos from "./manutencao/CadastroDefeitos.vue";

export default {
  name: "manutencao-component",
  components: {
    CadastroDefeitos,
  },
  data() {
    return {
      setor: null,
      maquina: null,
      listaSetores: [],
      listaMaquinas: [],
      maquinasObject: {},
      maquinasObjectOriginal: {},
      filtroTipo: null,
      checkbox: false,
      model: null,
    };
  },
  mounted() {
    this.queryMaquinas();
  },
  watch: {
    setor(newSetor) {
      this.maquina = null;
      this.updateListaMaquinas(newSetor);
      this.updatePesquisaMaquinas(newSetor);
      if (!newSetor) {
        this.maquinasObject = JSON.parse(JSON.stringify(this.maquinasObjectOriginal));
      }
    },
    maquina(newMaquina) {
      this.updatePesquisaMaquinas(newMaquina);
    },
  },
  methods: {
    queryMaquinas() {
      axios
        .get("http://localhost:3000/api/manual_maqs")
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
      this.setor = null;
      this.maquina = null;
    },
    updateListaMaquinas(setor) {
      this.listaMaquinas = [];
      this.listaMaquinas = this.maquinasObjectOriginal[setor] ? Object.keys(this.maquinasObjectOriginal[setor]) : [];
    },
    updatePesquisaMaquinas() {
      this.maquinasObject = JSON.parse(JSON.stringify(this.maquinasObjectOriginal));

      const newMaquinasObjectPesquisa = {};
      for (const setorNome in this.maquinasObject) {
        if (!this.setor || this.setor === setorNome) {
          newMaquinasObjectPesquisa[setorNome] = {};
          for (const maquinaNome in this.maquinasObject[setorNome]) {
            if (!this.maquina || this.maquina === maquinaNome) {
              newMaquinasObjectPesquisa[setorNome][maquinaNome] = {};
              for (const categoria in this.maquinasObject[setorNome][maquinaNome]) {
                newMaquinasObjectPesquisa[setorNome][maquinaNome][categoria] = [
                  ...this.maquinasObject[setorNome][maquinaNome][categoria],
                ];
                if (this.filtroTipo) {
                  newMaquinasObjectPesquisa[setorNome][maquinaNome][categoria] = newMaquinasObjectPesquisa[setorNome][
                    maquinaNome
                  ][categoria].filter((defeito) => defeito.includes(this.filtroTipo));
                }
              }
            }
          }
        }
      }

      this.maquinasObject = newMaquinasObjectPesquisa;
    },
    filtroDefeitos(tipo) {
      if (this.filtroTipo === tipo) {
        this.filtroTipo = null;
      } else {
        this.filtroTipo = tipo;
      }
      this.updatePesquisaMaquinas();
    },
  },
};
</script>
