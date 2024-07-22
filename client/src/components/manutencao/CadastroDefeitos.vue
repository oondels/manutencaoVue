<template>
  <v-form ref="form">
    <div class="col-12 row m-0">
      <div class="col-6 p-0 pe-1">
        <v-text-field
          variant="outlined"
          class="mb-2"
          v-model="nomeMaquina"
          label="Nome da Máquina"
          required
          outlined
        ></v-text-field>
      </div>
      <div class="col-6 p-0 ps-1">
        <v-select
          class="input"
          variant="outlined"
          v-model="setorSelecionado"
          :items="setores"
          label="Setor/Setores"
          multiple
          required
          clearable
          outlined
        ></v-select>
      </div>
    </div>

    <div v-for="(problema, index) in problemas" :key="index" class="border pl-4 pr-4 rounded mb-2">
      <p class="pt-3 pb-3">Defeito {{ index + 1 }}</p>
      <v-text-field
        class="input"
        v-model="problema.name"
        label="Nome do Defeito"
        variant="outlined"
        required
        outlined
      ></v-text-field>

      <div v-for="(category, cindex) in categories" :key="cindex">
        <div v-if="category.id !== 'checklist'">
          <h4 class="pb-2">{{ category.label }}</h4>

          <div col="12">
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="category.tagInput"
              :label="`Adicionar soluções para ${category.label}`"
              @keyup.enter="() => addTag(category.id)"
              @keydown.delete="() => removeLastTag(category.id)"
              outlined
            >
            </v-text-field>
          </div>
          <div col="12">
            <v-chip-group column>
              <v-chip
                v-for="(tag, indexx) in category.tags"
                :key="indexx"
                @click:close="removeTag(indexx)"
                :id="category.id"
                close
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </div>
    </div>

    <v-btn @click="addProblema" class="mb-3" color="info">Adicionar Defeito</v-btn>

    <div v-for="(category, cindex) in categories" :key="cindex">
      <div v-if="category.id === 'checklist'">
        <h4>{{ category.label }}</h4>
        <div col="12">
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="category.tagInput"
            :label="`Adicionar soluções para ${category.label}`"
            @keyup.enter="() => addTag(category.id)"
            @keydown.delete="() => removeLastTag(category.id)"
            outlined
          >
          </v-text-field>
        </div>
        <div col="12">
          <v-chip-group column>
            <v-chip v-for="(tag, index) in category.tags" :key="index" @click:close="removeTag(index)" :id="category.id" close>
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </div>

    <div class="col-12">
      <v-btn class="me-1" color="success" @click="validate">Cadastrar</v-btn>
      <v-btn color="red" @click="reset">Resetar Cadastro</v-btn>
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
      categories: [
        { id: "Operacional", label: "Soluções operacionais", tagInput: "", tags: [] },
        { id: "Mecânico", label: "Soluções mecânicas", tagInput: "", tags: [] },
        { id: "checklist", label: "Checklist de Itens", tagInput: "", tags: [] },
      ],
      tagChecklist: [],
      nomeMaquina: null,
      setorSelecionado: null,
      setores: ["Montagem", "Costura", "Corte Automático", "Serigrafia", "Bordado", "Apoio", "Lavagem", "Pré Solado"],
      problemas: [{ name: "", defeitos: "", tipo: "" }],
      csrfToken: "",
      campoRegra: [
        (value) => {
          if (value) return true;
          return "Este Campo é Obrigatório!";
        },
      ],
      checklistItens: null,
      newManual: {},
    };
  },
  mounted() {
    this.getCsrfToken();
  },
  methods: {
    addTag(categoryId) {
      const category = this.categories.find((c) => c.id === categoryId);
      if (category.tagInput && category.tagInput) {
        category.tags.push(category.tagInput);
        category.tagInput = "";
      }
    },
    removeLastTag(categoryId) {
      const category = this.categories.find((c) => c.id === categoryId);
      category.tags.pop();
    },
    addProblema() {
      this.problemas.push({ name: "", defeitos: "", tipo: "" });
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
          this.setorSelecionado !== null &&
          this.setorSelecionado.length > 0 &&
          this.nomeMaquina !== null &&
          this.categories.every((category) => category.tags.length > 0)
        ) {
          this.newManual = {};
          this.setorSelecionado.forEach((setor) => {
            this.newManual[setor] = {};
            this.newManual[setor][this.nomeMaquina] = {};
            this.newManual[setor][this.nomeMaquina]["Itens a verificar"] = [];

            this.problemas.forEach((problema, index) => {
              if (problema && problema.name) {
                this.newManual[setor][this.nomeMaquina][`Defeito ${index + 1} - ${problema.name}`] = [];

                this.categories.forEach((category) => {
                  if (category.id !== "checklist") {
                    category.tags.forEach((tag, tagIndex) => {
                      this.newManual[setor][this.nomeMaquina][`Defeito ${index + 1} - ${problema.name}`].push(
                        `Solução ${tagIndex + 1} - ${tag} (${category.id})`
                      );
                    });
                  } else {
                    category.tags.forEach((tag, tagIndex) => {
                      this.newManual[setor][this.nomeMaquina]["Itens a verificar"].push(`Item ${tagIndex + 1} - ${tag}`);
                    });
                  }
                });
              }
            });
          });
          console.log(this.newManual);
          // this.submit();
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
