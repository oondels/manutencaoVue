<template>
  <h1>Hello world!</h1>
  <lista-component :meuNome="nome" />
  <lista-component :meuNome="'Hendrius Félix'" />
  <input type="text" v-model="nome" name="" id="" />
  <lista-component :meuNome="maquinas" />
  <button @click="testeFunc()">Button</button>
</template>

<script>
import ListaComponent from "../components/ListaComponent.vue";
import axios from "axios";
export default {
  name: "manutencao-view",
  components: {
    ListaComponent,
  },
  data() {
    return {
      nome: "",
      maquinas: this.getMaquinas(),
    };
  },
  methods: {
    testeFunc() {
      axios
        .get("http://localhost:3000/tables")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    getMaquinas() {
      axios.get("http://localhost:3000/manual_maqs");
    },
  },
};
</script>

<style></style>
