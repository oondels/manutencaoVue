<template>
  <v-sheet class="mx-auto" width="100%" max-width="900">
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
        outlined
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
        outlined
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
          outlined
        ></v-text-field>
        <div class="radio-buttons-container">
          <div class="radio-button">
            <input
              :name="'radio-group-' + index"
              :id="'radio-mecanico-' + index"
              class="radio-button__input"
              value="Mecânico"
              v-model="problema.tipo"
              type="radio"
            />
            <label :for="'radio-mecanico-' + index" class="radio-button__label">
              <span class="radio-button__custom"></span>
              Mecânico
            </label>
          </div>
          <div class="radio-button">
            <input
              :name="'radio-group-' + index"
              :id="'radio-operacional-' + index"
              class="radio-button__input"
              value="Operacional"
              v-model="problema.tipo"
              type="radio"
            />
            <label :for="'radio-operacional-' + index" class="radio-button__label">
              <span class="radio-button__custom"></span>
              Operacional
            </label>
          </div>
        </div>

        <p>Soluções para o Defeito {{ index + 1 }}</p>
        <div class="textarea-container">
          <v-textarea
            class="input custom-textarea"
            v-model="problema.defeitos"
            label="Soluções"
            row-height="30"
            rows="5"
            variant="outlined"
            :rules="campoRegra"
            auto-grow
            shaped
            required
            outlined
          ></v-textarea>
          <div class="tooltip">Separe os items com espaço!</div>
        </div>
      </div>
      <v-btn class="btn add" @click="addProblema">Adicionar Defeito</v-btn>

      <p>Checklist</p>
      <div class="textarea-container">
        <v-textarea
          class="input custom-textarea"
          v-model="checklistItens"
          label="Itens para Verificar"
          row-height="30"
          :rules="campoRegra"
          rows="5"
          variant="outlined"
          auto-grow
          shaped
          required
          outlined
        ></v-textarea>
        <div class="tooltip">Separe os items com espaço!</div>
      </div>

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
      problemas: [{ name: null, defeitos: null, tipo: null }],
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
  methods: {
    addProblema() {
      this.problemas.push({ name: null, defeitos: null, tipo: null });
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (
          this.setorSelecionado !== null &&
          this.setorSelecionado.length > 0 &&
          this.nomeMaquina !== null &&
          this.checklistItens !== null &&
          this.problemas.length > 0
        ) {
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
                  this.newManual[setor][this.nomeMaquina][this.problemas[i].name].push(
                    `${j + 1} - ${itensDefeito[j]} (${this.problemas[i].tipo})`
                  );
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
          // console.log(this.newManual);
        }
      }
    },
    submit() {
      axios
        .post("http://localhost:3000/cadastro-maquina", this.newManual)
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

<style scoped>
.mx-auto {
  padding: 20px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Form */
.input {
  width: 100%;
  max-width: 600px;
  color: #004ea1;
}

.textarea-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.custom-textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  box-sizing: border-box;
}

.tooltip {
  visibility: hidden;
  width: 250px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -125px;
  opacity: 0;
  transition: opacity 0.3s;
}

.textarea-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.btn {
  width: 100%;
  max-width: 200px;
  margin-bottom: 15px;
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
  color: #fff !important;
}

.cadastro-problema {
  margin-bottom: 20px;
}

p {
  margin-bottom: 5px;
  color: #007bff;
  text-align: left;
}

.radio-buttons-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.radio-button {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.radio-button__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-button__label {
  display: inline-block;
  padding-left: 30px;
  margin-bottom: 10px;
  position: relative;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.radio-button__custom {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #555;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.radio-button__input:checked + .radio-button__label .radio-button__custom {
  transform: translateY(-50%) scale(0.9);
  border: 5px solid #4c8bf5;
  color: #4c8bf5;
}

.radio-button__input:checked + .radio-button__label {
  color: #4c8bf5;
}

.radio-button__label:hover .radio-button__custom {
  transform: translateY(-50%) scale(1.2);
  border-color: #4c8bf5;
  box-shadow: 0 0 10px #4c8bf580;
}
</style>
