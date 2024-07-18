<template>
  <v-sheet class="mx-auto">
    <h2>TPM - Cadastro de Máquinas</h2>
    <v-form ref="form">
      <p>Nome da Máquina</p>
      <v-text-field
        class="input"
        variant="outlined"
        v-model="nomeMaquina"
        :counter="30"
        :rules="campoRegra"
        label="Nome da Máquina"
        required
      ></v-text-field>
      <p>Selecione os Setores que a Máquina trabalha</p>
      <v-select
        class="input"
        variant="outlined"
        v-model="setorSelecionado"
        :items="setores"
        :rules="campoRegra"
        label="Setor/Setores"
        multiple
        required
        clearable
      ></v-select>

      <div v-for="(problema, index) in problemas" :key="index" class="cadastro-problema mb-3">
        <p>Defeito {{ index + 1 }}</p>
        <v-text-field
          class="input"
          v-model="problema.name"
          :counter="30"
          :rules="campoRegra"
          label="Nome do Defeito"
          variant="outlined"
          required
        ></v-text-field>

        <p>Soluções para o Defeito {{ index }}</p>
        <v-textarea
          class="input"
          v-model="problema.defeitos"
          label="Defeitos"
          row-height="30"
          rows="10"
          variant="outlined"
          :rules="campoRegra"
          auto-grow
          shaped
          required
        ></v-textarea>
      </div>
      <v-btn class="btn add" @click="addProblema">Adicionar Defeito</v-btn>

      <p>Checklist</p>
      <v-textarea
        class="input"
        v-model="checklistItens"
        label="Itens para Verificar"
        row-height="30"
        :rules="campoRegra"
        rows="10"
        variant="outlined"
        auto-grow
        shaped
        required
      ></v-textarea>
      <div class="d-flex flex-column mt-4">
        <v-btn class="btn cadastro" block @click="validate">Cadastrar</v-btn>
        <v-btn class="btn reset" block @click="reset">Resetar Cadastro</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      nomeMaquina: null,
      setorSelecionado: null,
      setores: ["Montagem", "Costura", "Corte Automático", "Serigrafia", "Bordado", "Apoio", "Lavagem", "Pré Solado"],
      problemas: [{ name: "", defeitos: "" }],
      nameRules: [(v) => !!v || "Este campo é obrigatório", (v) => (v && v.length <= 50) || "Máximo 50 caracteres"],
      campoRegra: [
        (value) => {
          if (value) return true;
          return "Este Campo é Obrigatório!";
        },
      ],
      checklistItens: "",
      newManual: {},
    };
  },
  methods: {
    addProblema() {
      this.problemas.push({ name: "", defeitos: "" });
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (this.setorSelecionado !== null || this.nomeMaquina !== null) {
          this.newManual = {};
          this.setorSelecionado.forEach((setor) => {
            this.newManual[setor] = {};
            this.newManual[setor][this.nomeMaquina] = {};
            this.newManual[setor][this.nomeMaquina]["Itens a verificar"] = [];

            for (let i = 0; i < this.problemas.length; i++) {
              let itensDefeito = this.problemas[i].defeitos.split("\n");
              this.newManual[setor][this.nomeMaquina][this.problemas[i].name] = [];
              for (let j = 0; j < itensDefeito.length; j++) {
                if (itensDefeito[j] !== "" || itensDefeito[j] !== undefined) {
                  this.newManual[setor][this.nomeMaquina][this.problemas[i].name].push(`${j + 1} - ${itensDefeito[j]}`);
                }
              }
            }

            const itensChecklistFilter = this.checklistItens.split("\n");
            for (let i = 0; i < itensChecklistFilter.length; i++) {
              if (itensChecklistFilter[i] !== "") {
                this.newManual[setor][this.nomeMaquina]["Itens a verificar"].push(`${i + 1} - ${itensChecklistFilter[i]}`);
              }
            }
          });
          this.submit();
        }
      }
    },
    submit() {
      axios
        .post("http://localhost:3000/cadastro-maquina", this.newManual)
        .then((response) => {
          console.log("Resposta do server:", response.data);
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

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
* {
  font-family: "Poppins", sans-serif;
}

.mx-auto h2 {
  color: #0056b3;
  font-size: 32px;
  background: transparent;
  padding: 20px 0;
}

.mx-auto {
  background: #ffffff !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center;
  justify-content: center;
}

.input {
  width: 500px;
  color: #004ea1;
}

.btn {
  width: 230px !important;
  margin-bottom: 15px !important;
}

.cadastro {
  background: #007bff !important;
  color: #fff !important;
}

.add {
  background: #28a745 !important;
  color: #fff !important;
}

.reset {
  background: #e68585 !important;
  width: 10px !important;
  color: #fff !important;
}

p {
  margin-bottom: 5px;
  color: #007bff;
  text-align: left;
}
</style>
