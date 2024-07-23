<template>
  <div class="container my-5 p-4 bg-light rounded shadow-sm">
    <h1 class="text-center mb-4 text-primary">TPM - Manual de Máquinas</h1>
    <div class="mb-3">
      <v-expansion-panels>
        <v-expansion-panel title="Cadastrar Máquina">
          <v-expansion-panel-text>
            <cadastro-defeitos />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div class="row mb-4">
      <div class="col-md-6 mb-3 mb-md-0">
        <v-select
          clearable
          variant="outlined"
          density="compact"
          class="custom-select"
          label="Setores"
          :items="listaSetores"
          v-model="setor"
          outlined
          color="#2196F3"
        ></v-select>
      </div>

      <div class="col-md-6">
        <v-select
          clearable
          variant="outlined"
          density="compact"
          class="custom-select"
          label="Máquinas"
          :items="listaMaquinas"
          v-model="maquina"
          outlined
          color="#2196F3"
        ></v-select>
      </div>
    </div>

    <div>
      <div class="mb-3">
        <p class="text-secondary">Deseja aplicar um filtro?</p>
        <v-btn
          :class="{ active: filtroTipo === 'Mecânico' }"
          class="btn btn-outline-primary me-2"
          @click="filtroDefeitos('Mecânico')"
        >
          Mecânico
        </v-btn>
        <v-btn
          :class="{ active: filtroTipo === 'Operacional' }"
          class="btn btn-outline-primary"
          @click="filtroDefeitos('Operacional')"
        >
          Operacional
        </v-btn>
      </div>
      <div v-for="(maquinas, setorNome) in maquinasObject" :key="setorNome">
        <h2 class="my-4 text-blue">{{ setorNome }}</h2>
        <div v-if="maquinas">
          <div v-for="(categorias, maquinaNome) in maquinas" :key="maquinaNome">
            <v-expansion-panels>
              <v-expansion-panel class="mb-3" :title="maquinaNome">
                <v-expansion-panel-text>
                  <div v-for="(problemas, categoriaNome) in categorias" :key="categoriaNome">
                    <v-expansion-panels>
                      <v-expansion-panel class="mb-2" :title="categoriaNome">
                        <v-expansion-panel-text>
                          <div v-if="problemas.length > 0">
                            <v-card class="card mx-auto p-2" max-width="700">
                              <v-list>
                                <v-list-item
                                  v-for="(problema, problemaId) in problemas"
                                  :key="problemaId"
                                  :value="problema"
                                  color="primary"
                                  rounded="xl"
                                  class="list-group-item d-flex justify-content-between align-items-center"
                                >
                                  <v-list-item-title v-text="problema"></v-list-item-title>
                                  <template v-slot:append>
                                    <i style="color: #2196f3; font-size: 1.25rem" :class="getIcon(problema)"></i>
                                  </template>
                                </v-list-item>
                              </v-list>
                            </v-card>
                          </div>
                          <div v-else>
                            <p class="text-muted">Sem Informações Cadastradas para esta categoria.</p>
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
          <h4>Sem máquinas no setor!</h4>
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
    getIcon(tag) {
      if (tag.includes("Mecânico")) {
        return "bi bi-gear";
      } else if (tag.includes("Operacional")) {
        return "bi bi-person-fill";
      }
    },
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

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  background: #e6f0fa;
  padding: 30px;
}
h1,
h2 {
  color: #0d9757;
}
.v-btn.active {
  background-color: #0056b3 !important;
  color: #fff !important;
}
.v-expansion-panel .v-expansion-panel-text {
  padding: 1rem;
}
</style>
