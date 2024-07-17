<template>
  <v-sheet class="mx-auto" width="600">
    <h1>Cadastro De Máquinas - Defeitos/Soluções</h1>
    <v-form ref="form">
      <v-text-field v-model="nomeMaquina" :counter="30" :rules="nameRules" label="Nome da Máquina" required></v-text-field>
      <v-select
        v-model="setorSelecionado"
        :items="setores"
        :rules="[(v) => !!v || 'Item is required']"
        label="Setor"
        required
      ></v-select>

      <div v-for="(problema, index) in problemas" :key="index" class="cadastro-problema mb-3">
        <v-text-field
          v-model="problema.name"
          :counter="30"
          :rules="nameRules"
          :label="`Problema -${index + 1}`"
          required
        ></v-text-field>
        <v-textarea
          v-model="problema.defeitos"
          label="Defeitos"
          row-height="30"
          rows="10"
          variant="filled"
          auto-grow
          shaped
        ></v-textarea>
      </div>
      <v-btn @click="addProblema">Adicionar Defeito</v-btn>
      <v-textarea
        v-model="checklistItens"
        label="Itens a Verificar (Checklist)"
        row-height="30"
        rows="10"
        variant="filled"
        auto-grow
        shaped
      ></v-textarea>
      <div class="d-flex flex-column mt-4">
        <v-btn color="success" block @click="validate">Validate</v-btn>
        <v-btn color="error" block @click="reset">Reset Form</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      nomeMaquina: "",
      setorSelecionado: null,
      setores: ["Setor 1", "Setor 2", "Setor 3"],
      problemas: [{ name: "", defeitos: "" }],
      nameRules: [(v) => !!v || "Este campo é obrigatório", (v) => (v && v.length <= 30) || "Máximo 30 caracteres"],
      checklistItens: "",
    };
  },
  methods: {
    addProblema() {
      this.problemas.push({ name: "", defeitos: "" });
    },
    validate() {
      this.$refs.form.validate();
      const newMachine = {};
      newMachine[this.setorSelecionado] = {};
      newMachine[this.setorSelecionado][this.nomeMaquina] = {};
      newMachine[this.setorSelecionado][this.nomeMaquina]["Itens a verificar"] = [];

      for (let i = 0; i < this.problemas.length; i++) {
        newMachine[this.setorSelecionado][this.nomeMaquina][this.problemas.nome] = {};

        let itensDefeito = this.problemas[i].defeitos.split("\n");
        newMachine[this.setorSelecionado][this.nomeMaquina][this.problemas[i].name] = [];
        for (let j = 0; j < itensDefeito.length; j++) {
          if (itensDefeito[j] !== "") {
            newMachine[this.setorSelecionado][this.nomeMaquina][this.problemas[i].name].push(itensDefeito[j]);
          }
        }
      }

      const itensChecklistFilter = this.checklistItens.split("\n");
      for (let i = 0; i < itensChecklistFilter.length; i++) {
        if (itensChecklistFilter[i] !== "") {
          newMachine[this.setorSelecionado][this.nomeMaquina]["Itens a verificar"].push(itensChecklistFilter[i]);
        }
      }
      console.log(newMachine);
    },
    reset() {
      this.$refs.form.reset();
      this.problemas = [{ name: "", defeitos: "" }];
    },
  },
};
</script>

<style>
.cadastro-problema {
  margin-bottom: 20px;
}
</style>
