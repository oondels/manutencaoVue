<template>
  <v-form ref="form" class="p-4" style="border-radius: 8px">
    <div class="row g-3">
      <div class="col-md-6">
        <v-text-field
          v-model="nomeMaquina"
          label="Nome da Máquina"
          required
          outlined
          color="#2196F3"
          class="mb-3"
          style="background-color: white; border-radius: 4px"
        ></v-text-field>
      </div>
      <div class="col-md-6">
        <v-select
          v-model="setorSelecionado"
          :items="setores"
          label="Setor/Setores"
          multiple
          required
          clearable
          outlined
          color="#2196F3"
          class="mb-3"
          style="background-color: white; border-radius: 4px"
        ></v-select>
      </div>
    </div>

    <div class="mb-8" v-for="(problema, problemaIndex) in problemas" :key="problemaIndex">
      <div class="p-3 mb-3" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25)">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="pb-2" style="color: #0d47a1">Defeito {{ problemaIndex + 1 }}</h5>
          <v-btn @click="removeProblema(problemaIndex)" v-if="problemaIndex > 0" class="btn-thin">
            <span class="material-symbols-outlined"> delete </span>
          </v-btn>
        </div>

        <v-text-field
          v-model="problema.name"
          :label="'Nome do Defeito ' + (problemaIndex + 1)"
          variant="outlined"
          required
          outlined
          color="#2196F3"
          style="background-color: white; border-radius: 4px"
        ></v-text-field>

        <h5 class="pb-2" style="color: #0d47a1">Soluções Mecânico</h5>
        <v-text-field
          variant="outlined"
          density="compact"
          v-model="problema.Mecanico.input"
          :label="`Adicionar soluções para Defeito Mecânico`"
          @keyup.enter="() => addTag(problema.Mecanico.input, problemaIndex, 'Mecanico')"
          outlined
          color="#2196F3"
          style="background-color: white; border-radius: 4px"
        ></v-text-field>
        <v-chip-group column>
          <v-chip
            v-for="(tagMecanico, tagIndexMecanico) in problema.Mecanico.defeitos || []"
            :key="tagIndexMecanico"
            @click="() => removeTag(tagIndexMecanico, problemaIndex, 'Mecanico')"
            close
            class="me-2 mb-2"
            color="#2196F3"
            text-color="white"
          >
            {{ tagMecanico }}
          </v-chip>
        </v-chip-group>

        <h5 class="pb-2" style="color: #0d47a1">Soluções Operacionais</h5>
        <v-text-field
          variant="outlined"
          density="compact"
          v-model="problema.Operacional.input"
          :label="`Adicionar soluções para Defeito Operacional`"
          @keyup.enter="() => addTag(problema.Operacional.input, problemaIndex, 'Operacional')"
          outlined
          color="#2196F3"
          class="mb-3"
          style="background-color: white; border-radius: 4px"
        ></v-text-field>
        <v-chip-group column class="mb-3">
          <v-chip
            v-for="(tagOperacional, tagIndexOperacional) in problema.Operacional.defeitos || []"
            :key="tagIndexOperacional"
            @click="() => removeTag(tagIndexOperacional, problemaIndex, 'Operacional')"
            close
            class="me-2 mb-2"
            color="#2196F3"
            text-color="white"
          >
            {{ tagOperacional }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <v-btn @click="addProblema" class="mb-3" color="#2196F3" text-color="white">Adicionar Defeito</v-btn>

    <div v-for="(item, itemIndex) in checklist" :key="itemIndex">
      <h5 class="pb-2" style="color: #0d47a1">Itens do Checklist Operacional</h5>
      <v-text-field
        variant="outlined"
        density="compact"
        v-model="item.Operacional.input"
        :label="`Adicionar soluções para Defeito Operacional`"
        @keyup.enter="() => addTag(item.Operacional.input, itemIndex, 'Operacional', 1)"
        outlined
        color="#2196F3"
        class="mb-3"
        style="background-color: white; border-radius: 4px"
      ></v-text-field>
      <v-chip-group column class="mb-3">
        <v-chip
          v-for="(tagChecklist, tagIndex) in item.Operacional.itens || []"
          :key="tagIndex"
          @click="() => removeTag(tagIndex, itemIndex, 'Operacional', 1)"
          close
          class="me-2 mb-2"
          color="#2196F3"
          text-color="white"
        >
          {{ tagChecklist }}
        </v-chip>
      </v-chip-group>

      <h5 class="pb-2" style="color: #0d47a1">Itens do Checklist Mecanico</h5>
      <v-text-field
        variant="outlined"
        density="compact"
        v-model="item.Mecanico.input"
        :label="`Adicionar soluções para Defeito Mecanico`"
        @keyup.enter="() => addTag(item.Mecanico.input, itemIndex, 'Mecanico', 1)"
        outlined
        color="#2196F3"
        class="mb-3"
        style="background-color: white; border-radius: 4px"
      ></v-text-field>
      <v-chip-group column class="mb-3 d-flex flex-wrap">
        <v-chip
          v-for="(tagChecklist, tagIndex) in item.Mecanico.itens || []"
          :key="tagIndex"
          @click="() => removeTag(tagIndex, itemIndex, 'Mecanico', 1)"
          close
          class="shadow-sm"
          color="primary"
          outlined
        >
          {{ tagChecklist }}
        </v-chip>
      </v-chip-group>
    </div>

    <div class="d-flex justify-content-center">
      <v-btn color="success" class="m-2" text-color="white" @click="validate">Cadastrar</v-btn>
      <v-btn color="red" class="m-2" text-color="white" @click="reset">Resetar Cadastro</v-btn>
    </div>
  </v-form>
</template>

<script>
import axios from "axios";
// import ip from "../../../../ip";
export default {
  name: "cadastro-defeitos",
  data() {
    return {
      problemas: [{ name: "", Operacional: { defeitos: [], input: "" }, Mecanico: { defeitos: [], input: "" } }],
      checklist: [{ Operacional: { itens: [], input: "" }, Mecanico: { itens: [], input: "" } }],
      allProblems: [],
      nomeMaquina: null,
      setorSelecionado: null,
      setores: ["Montagem", "Costura", "Corte Automático", "Serigrafia", "Bordado", "Apoio", "Lavagem", "Pré Solado"],
      csrfToken: "",
      campoRegra: [
        (value) => {
          if (value) return true;
          return "Este Campo é Obrigatório!";
        },
      ],
      newManual: {},
    };
  },
  mounted() {
    this.getCsrfToken();
  },
  methods: {
    addTag(input, index, category, checklist) {
      if (!checklist) {
        const problema = this.problemas[index];
        if (input && !problema[category].defeitos.includes(input)) {
          problema[category].defeitos.push(`${input} (${category})`);
          problema[category].input = "";
        }
      } else {
        const item = this.checklist[index];
        if (input && !item[category].itens.includes(input)) {
          item[category].itens.push(`${input} (${category})`);
          item[category].input = "";
        }
      }
    },
    removeTag(tagIndex, mainIndex, category, checklist) {
      if (!checklist) {
        const problema = this.problemas[mainIndex];
        problema[category].defeitos.splice(tagIndex, 1);
      } else {
        const item = this.checklist[mainIndex];
        item[category].itens.splice(tagIndex, 1);
      }
    },
    addProblema() {
      this.problemas.push({
        Operacional: { name: "", defeitos: [], input: "" },
        Mecanico: { name: "", defeitos: [], input: "" },
      });
    },
    removeProblema(problemaIndex) {
      this.problemas.splice(problemaIndex, 1);
    },
    async getCsrfToken() {
      try {
        const response = await axios.get(`http://localhost:3000/csrf-token`, { withCredentials: true });

        this.csrfToken = response.data.csrfToken;

        axios.defaults.headers.common["X-CSRF-Token"] = this.csrfToken;
      } catch (error) {
        console.error("Erro ao obter o token CSRF:", error);
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (
          this.setorSelecionado &&
          this.setorSelecionado.length > 0 &&
          this.nomeMaquina &&
          this.problemas.every((problema) => problema.name)
        ) {
          this.newManual = {};
          this.setorSelecionado.forEach((setor) => {
            this.newManual[setor] = {};
            this.newManual[setor][this.nomeMaquina] = {};
            this.newManual[setor][this.nomeMaquina]["Itens a verificar"] = [];

            Object.keys(this.problemas[0]).forEach((category) => {
              console.log(category);
              this.problemas.forEach((problema, index) => {
                if (!this.newManual[setor][this.nomeMaquina][`Defeito ${index + 1} - ${problema.name}`]) {
                  this.newManual[setor][this.nomeMaquina][`Defeito ${index + 1} - ${problema.name}`] = [];
                }
                if (category !== "name") {
                  if (problema && problema.name) {
                    problema[category].defeitos.forEach((p) => {
                      this.newManual[setor][this.nomeMaquina][`Defeito ${index + 1} - ${problema.name}`].push(`Solução - ${p}`);
                    });
                  }
                }
              });
            });

            Object.keys(this.checklist[0]).forEach((category) => {
              this.checklist[0][category].itens.forEach((item) => {
                this.newManual[setor][this.nomeMaquina]["Itens a verificar"].push(`Item - ${item}`);
              });
            });
          });
          // console.log(this.newManual);
          this.submit();
        }
      }
    },
    submit() {
      axios
        .post(`http://localhost:3000/cadastro-maquina`, this.newManual, {
          headers: {
            "X-CSRF-Token": this.csrfToken,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log("Resposta do server:", response.data);
          alert("Máquina cadastrada com Sucesso!");
          this.reset();
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    },
    reset() {
      this.$refs.form.reset();
      this.problemas = [{ name: "", defeitos: "" }];
    },
  },
};
</script>
