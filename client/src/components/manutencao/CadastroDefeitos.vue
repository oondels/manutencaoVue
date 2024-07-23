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

    <div
      v-for="(problema, index) in problemas"
      :key="index"
      class="p-3 mb-3"
      style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25)"
    >
      <p class="fw-bold" style="color: #0d47a1">Defeito {{ index + 1 }}</p>
      <v-text-field
        v-model="problema.name"
        label="Nome do Defeito"
        variant="outlined"
        required
        outlined
        color="#2196F3"
        class="mb-3"
        style="background-color: white; border-radius: 4px"
      ></v-text-field>

      <div v-for="(category, cindex) in categories" :key="cindex">
        <div v-if="category.id !== 'checklist'">
          <h5 class="pb-2" style="color: #0d47a1">{{ category.label }}</h5>
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="category.tagInput"
            :label="`Adicionar soluções para ${category.label}`"
            @keyup.enter="() => addTag(category.id)"
            @keydown.delete="() => removeLastTag(category.id)"
            outlined
            color="#2196F3"
            class="mb-3"
            style="background-color: white; border-radius: 4px"
          ></v-text-field>
          <v-chip-group column class="mb-3">
            <v-chip
              v-for="(tag, indexx) in category.tags"
              :key="indexx"
              @click:close="removeTag(indexx)"
              :id="category.id"
              close
              class="me-2 mb-2"
              color="#2196F3"
              text-color="white"
            >
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </div>

    <v-btn @click="addProblema" class="mb-3" color="#2196F3" text-color="white">Adicionar Defeito</v-btn>

    <div v-for="(category, cindex) in categories" :key="cindex">
      <div v-if="category.id === 'checklist'">
        <h5 style="color: #0d47a1">{{ category.label }}</h5>
        <v-text-field
          variant="outlined"
          density="compact"
          v-model="category.tagInput"
          :label="`Adicionar soluções para ${category.label}`"
          @keyup.enter="() => addTag(category.id)"
          @keydown.delete="() => removeLastTag(category.id)"
          outlined
          color="#2196F3"
          class="mb-3"
          style="background-color: white; border-radius: 4px"
        ></v-text-field>
        <v-chip-group column class="mb-3">
          <v-chip
            v-for="(tag, index) in category.tags"
            :key="index"
            @click:close="removeTag(index)"
            :id="category.id"
            close
            class="me-2 mb-2"
            color="#2196F3"
            text-color="white"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </div>
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
